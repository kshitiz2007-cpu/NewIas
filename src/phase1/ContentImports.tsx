import { useMemo, useRef, useState } from "react";
import { supabase } from "../supabase";
import { AlertCircle, CheckCircle2, Download, FileSpreadsheet, FileUp, FileText, X } from "lucide-react";

type CsvQuestion = {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: string;
  explanation: string;
  subject: string;
  topic: string;
  language: string;
};
type LocalPdf = { id: string; name: string; size: number; path: string; status: "uploading" | "uploaded" | "error"; error?: string };

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') { cell += '"'; i++; }
      else quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell.trim()); cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(cell.trim()); cell = "";
      if (row.some(value => value.length)) rows.push(row);
      row = [];
    } else cell += char;
  }
  row.push(cell.trim());
  if (row.some(value => value.length)) rows.push(row);
  return rows;
}

const headers = ["question", "option_a", "option_b", "option_c", "option_d", "answer", "explanation", "subject", "topic", "language"];
const template = [
  headers.join(","),
  '"भारतीय संविधान कब लागू हुआ?","26 जनवरी 1950","15 अगस्त 1947","26 नवंबर 1949","2 अक्टूबर 1950","A","संविधान 26 जनवरी 1950 को लागू हुआ।","भारतीय राजव्यवस्था","संविधान निर्माण","Hindi"'
].join("\n");

function downloadTemplate() {
  const blob = new Blob(["\uFEFF" + template], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; link.download = "NewIAS-question-import-template.csv"; link.click();
  URL.revokeObjectURL(url);
}

export function CsvImporter() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [questions, setQuestions] = useState<CsvQuestion[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const validCount = useMemo(() => questions.filter(q => q.question && q.optionA && q.optionB && q.optionC && q.optionD && /^[A-D]$/i.test(q.answer)).length, [questions]);

  async function loadFile(file?: File) {
    if (!file) return;
    if (!/\.csv$/i.test(file.name) && file.type !== "text/csv") {
      setErrors(["Please choose a .csv file."]); setQuestions([]); return;
    }
    setBusy(true); setMessage(""); setFileName(file.name); setErrors([]);
    try {
      const raw = (await file.text()).replace(/^\uFEFF/, "");
      const rows = parseCsv(raw);
      if (rows.length < 2) { setQuestions([]); setErrors(["CSV में header और कम-से-कम एक question row होना चाहिए।"]); return; }
      const normalise = (s: string) => s.toLowerCase().trim().replace(/[\s-]+/g, "_");
      const first = rows[0].map(normalise);
      const aliases: Record<string, string[]> = {
        question: ["question", "प्रश्न", "प्रश्न_text"], option_a: ["option_a", "optiona", "a", "विकल्प_a"],
        option_b: ["option_b", "optionb", "b", "विकल्प_b"], option_c: ["option_c", "optionc", "c", "विकल्प_c"],
        option_d: ["option_d", "optiond", "d", "विकल्प_d"], answer: ["answer", "correct_answer", "उत्तर"],
        explanation: ["explanation", "व्याख्या"], subject: ["subject", "विषय"], topic: ["topic", "टॉपिक"],
        language: ["language", "भाषा"]
      };
      const index: Record<string, number> = {};
      Object.entries(aliases).forEach(([key, variants]) => { index[key] = first.findIndex(h => variants.includes(h)); });
      const missing = ["question", "option_a", "option_b", "option_c", "option_d", "answer"].filter(k => index[k] < 0);
      if (missing.length) { setQuestions([]); setErrors(["Required columns missing: " + missing.join(", "), "Download the NewIAS CSV template and keep the header names unchanged."]); return; }
      const parsed = rows.slice(1).map(row => ({
        question: row[index.question] ?? "", optionA: row[index.option_a] ?? "", optionB: row[index.option_b] ?? "",
        optionC: row[index.option_c] ?? "", optionD: row[index.option_d] ?? "", answer: (row[index.answer] ?? "").toUpperCase().replace(/^OPTION\s*/, ""),
        explanation: index.explanation >= 0 ? row[index.explanation] ?? "" : "",
        subject: index.subject >= 0 ? row[index.subject] ?? "" : "", topic: index.topic >= 0 ? row[index.topic] ?? "" : "",
        language: index.language >= 0 ? row[index.language] ?? "Hindi" : "Hindi"
      }));
      const foundErrors: string[] = [];
      parsed.forEach((q, i) => {
        const line = i + 2;
        if (!q.question) foundErrors.push(`Row ${line}: question is empty.`);
        if (![q.optionA, q.optionB, q.optionC, q.optionD].every(Boolean)) foundErrors.push(`Row ${line}: all four options are required.`);
        if (!/^[A-D]$/.test(q.answer)) foundErrors.push(`Row ${line}: answer must be A, B, C or D.`);
      });
      setQuestions(parsed); setErrors(foundErrors.slice(0, 80));
      setMessage(`Read ${parsed.length} question rows. ${foundErrors.length ? "Fix the validation errors before importing." : "All rows passed basic validation."}`);
    } catch {
      setErrors(["Could not read this file. Save it as UTF-8 CSV and try again."]); setQuestions([]);
    } finally { setBusy(false); }
  }

  function reset() {
    setQuestions([]); setErrors([]); setFileName(""); setMessage("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return <section className="import-panel">
    <div className="studio-panel-heading"><div><h3><FileSpreadsheet size={16}/> Bulk question import</h3><p>Upload a CSV, validate question rows and review a preview before the future database import.</p></div><span className="draft-pill">CSV IMPORTER</span></div>
    <div className="import-toolbar"><button className="studio-secondary" onClick={downloadTemplate}><Download size={14}/> Download CSV template</button><button className="studio-publish" onClick={() => inputRef.current?.click()}><FileUp size={14}/> Choose CSV file</button><input ref={inputRef} hidden type="file" accept=".csv,text/csv" onChange={e => loadFile(e.target.files?.[0])}/></div>
    <div className="import-drop" role="button" tabIndex={0} onClick={() => inputRef.current?.click()} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}><FileSpreadsheet size={25}/><strong>{busy ? "Reading CSV…" : fileName || "Select a CSV question bank"}</strong><span>Required: question, option_a, option_b, option_c, option_d, answer</span><small>Quoted commas and UTF-8 Hindi text are supported.</small></div>
    {message && <div className="import-message"><CheckCircle2 size={15}/>{message}</div>}
    {errors.length > 0 && <div className="import-errors"><div><AlertCircle size={15}/><strong>Validation issues ({errors.length})</strong></div>{errors.slice(0, 12).map((error, i) => <p key={i}>{error}</p>)}{errors.length > 12 && <small>Showing first 12 issues.</small>}</div>}
    {questions.length > 0 && <><div className="import-stats"><span><b>{questions.length}</b> rows read</span><span><b>{validCount}</b> valid</span><span><b>{questions.length - validCount}</b> needing fixes</span></div><div className="import-preview-table"><table><thead><tr><th>#</th><th>Question</th><th>Options A–D</th><th>Answer</th><th>Subject / topic</th></tr></thead><tbody>{questions.slice(0, 8).map((q, i) => <tr key={i}><td>{i + 1}</td><td>{q.question || "—"}</td><td>A. {q.optionA}<br/>B. {q.optionB}<br/>C. {q.optionC}<br/>D. {q.optionD}</td><td>{q.answer || "—"}</td><td>{[q.subject, q.topic].filter(Boolean).join(" / ") || "—"}</td></tr>)}</tbody></table>{questions.length > 8 && <small>Showing 8 of {questions.length} rows.</small>}</div><div className="import-footer"><button className="studio-secondary" onClick={reset}><X size={14}/> Clear import</button><button className="studio-publish" disabled={validCount !== questions.length || questions.length === 0} onClick={() => setMessage("Preview validated. Database import is not enabled yet; no records have been saved.")}>Validate import <CheckCircle2 size={14}/></button></div></>}
    <p className="import-disclaimer">Preview and validation only. This does not write to Supabase or publish a test yet.</p>
  </section>;
}

export function PdfUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<LocalPdf[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function addFiles(list: FileList | null) {
    if (!list?.length) return;
    setError("");
    const incoming = Array.from(list);
    const invalid = incoming.filter(f => f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf"));
    const tooLarge = incoming.filter(f => f.size > 50 * 1024 * 1024);
    if (invalid.length) setError("Only PDF files are accepted; unsupported files were skipped.");
    if (tooLarge.length) setError("Each PDF must be 50 MB or smaller; oversized files were skipped.");
    const accepted = incoming.filter(f => (f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")) && f.size <= 50 * 1024 * 1024);
    if (!accepted.length) { if (inputRef.current) inputRef.current.value = ""; return; }
    if (!supabase) {
      setError("Upload service is not configured. Please contact the administrator.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setBusy(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Your session expired. Sign in again and retry the upload.");
      const { data: institute, error: instituteError } = await supabase.from("institutes").select("id").eq("slug", "newias").maybeSingle();
      if (instituteError) throw instituteError;
      if (!institute) throw new Error("NewIAS institute was not found in this Supabase project.");
      for (const file of accepted) {
        const safeName = file.name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-").slice(-100) || "resource.pdf";
        const path = `${institute.id}/uploads/${crypto.randomUUID()}-${safeName}`;
        const id = `${file.name}-${file.size}-${file.lastModified}`;
        setFiles(prev => [...prev, { id, name: file.name, size: file.size, path, status: "uploading" }]);
        const { error: uploadError } = await supabase.storage.from("newias-content").upload(path, file, { contentType: "application/pdf", upsert: false });
        if (uploadError) {
          setFiles(prev => prev.map(item => item.id === id ? { ...item, status: "error", error: uploadError.message } : item));
          throw new Error(`Could not upload ${file.name}: ${uploadError.message}`);
        }
        setFiles(prev => prev.map(item => item.id === id ? { ...item, status: "uploaded" } : item));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Check your connection and try again.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return <section className="import-panel">
    <div className="studio-panel-heading"><div><h3><FileText size={16}/> PDF resource upload</h3><p>Upload study notes, book chapters, magazines and reference PDFs to secure NewIAS storage.</p></div><span className="draft-pill">PDF LIBRARY</span></div>
    <input ref={inputRef} hidden type="file" accept="application/pdf,.pdf" multiple onChange={e => { void addFiles(e.currentTarget.files); }}/>
    <button type="button" className="pdf-drop" disabled={busy} onClick={() => inputRef.current?.click()}><FileUp size={24}/><strong>{busy ? "Uploading selected PDFs…" : "Choose PDF files"}</strong><span>PDF only · maximum 50 MB per file · multiple files supported</span></button>
    {error && <div className="import-errors" role="alert"><div><AlertCircle size={15}/><strong>{error}</strong></div></div>}
    {files.length === 0 ? <div className="pdf-empty"><FileText size={22}/><strong>No PDFs uploaded yet</strong><span>Choose PDFs; uploads will be sent to private NewIAS storage.</span></div> : <div className="pdf-file-list">{files.map(item => <article className="pdf-file-card" key={item.id}><span className="pdf-file-icon"><FileText size={20}/></span><div className="pdf-file-info"><strong>{item.name}</strong><small>{(item.size / (1024 * 1024)).toFixed(2)} MB · {item.status === "uploaded" ? "Uploaded to private storage" : item.status === "uploading" ? "Uploading…" : item.error || "Upload failed"}</small></div>{item.status === "uploaded" ? <CheckCircle2 size={18} aria-label="Uploaded"/> : item.status === "error" ? <AlertCircle size={18} aria-label="Upload failed"/> : null}</article>)}</div>}
    <p className="import-disclaimer">Files are uploaded to the private newias-content bucket. Adding them to a published library entry is a separate publishing step.</p>
  </section>;
}
