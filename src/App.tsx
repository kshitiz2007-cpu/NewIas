import { useEffect, useState, type FormEvent } from "react";
import { NavLink, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Activity, ArrowRight, Bell, BookOpen, CalendarClock, CalendarDays, CheckCircle2, ChevronDown, Clock3, FilePenLine, FileText, GraduationCap, LayoutGrid, Layers3, Menu, Radio, Search, Settings2, ShieldCheck, Sparkles, BrainCircuit, Target, UsersRound, Workflow, SlidersHorizontal, X, Save, Send, Tags, AlertCircle, Sun, Moon, LogOut } from "lucide-react";
import { AdminOverview, ClassesPage, ClassManagement, SettingsPage, StudentsPage, TestsPage } from "./phase1/Modules";
import { CsvImporter, PdfUploader } from "./phase1/ContentImports";
import { Performance360 } from "./phase1/Performance360";
import { AssessmentEngine } from "./phase1/AssessmentEngine";
import { Phase2Cms, Phase2Library } from "./phase2/Phase2";
import type { User } from "@supabase/supabase-js";
import { supabase, ADMIN_EMAIL, isAdminEmail } from "./supabase";

type NavItem = { to: string; label: string; icon: typeof Activity };
const student: NavItem[] = [
 {to:"/",label:"Home",icon:LayoutGrid},
 {to:"/library",label:"Study",icon:BookOpen},
 {to:"/tests",label:"Practice",icon:BrainCircuit},
 {to:"/classes",label:"Classes",icon:Radio},
 {to:"/performance",label:"Progress",icon:Activity}
];
const admin: NavItem[] = [
 {to:"/admin",label:"Admin overview",icon:ShieldCheck},
 {to:"/admin/content",label:"Content studio",icon:FilePenLine},
 {to:"/admin/cms",label:"CMS & publishing",icon:Workflow},
 {to:"/admin/students",label:"Students & batches",icon:UsersRound},
 {to:"/admin/classes",label:"Class management",icon:CalendarClock},
 {to:"/admin/settings",label:"Platform settings",icon:SlidersHorizontal}
];
const pages: Record<string,{title:string;subtitle:string}> = {
 "/":{title:"Your preparation, in focus.",subtitle:"A clearer path from daily effort to exam readiness."},
 "/classes":{title:"Live & recorded classes",subtitle:"Discover your timetable, join sessions and revisit recordings."},
 "/tests":{title:"Mock test centre",subtitle:"Practise under exam conditions and learn from every attempt."},
 "/library":{title:"Digital library",subtitle:"Find notes, current affairs, editorials and reference material."},
 "/library/workspace":{title:"Resource explorer",subtitle:"Browse published learning resources, save bookmarks and continue reading."},
 "/admin/cms":{title:"CMS & publishing",subtitle:"Manage content workspaces, review, publishing states and resource versions."},
 "/performance":{title:"360° performance",subtitle:"Track your progress, identify gaps and plan what to improve."},
 "/admin":{title:"Institute overview",subtitle:"A central workspace for academic delivery and operations."},
 "/admin/content":{title:"Content studio",subtitle:"Create, organise, review and publish learning resources."},
 "/admin/students":{title:"Students & batches",subtitle:"Manage learners, cohorts, enrolments and academic progress."},
 "/admin/classes":{title:"Class management",subtitle:"Schedule sessions and configure supported video providers."},
 "/admin/settings":{title:"Platform settings",subtitle:"Manage institute configuration and access policies."}
};
function Metric({label,value,detail,icon:Icon,kind="compact"}:{label:string;value:string;detail:string;icon:typeof Activity;kind?:"feature"|"compact"|"progress"}) {
 const [display,setDisplay]=useState(value);
 useEffect(()=>{const target=label==="Study time"?1120:label==="Practice accuracy"?78.4:label==="Learning streak"?9:label==="Syllabus coverage"?32:null;if(target===null)return;let start=0;let frame=0;let stopped=false;const step=(now:number)=>{if(stopped)return;if(!start)start=now;const p=Math.min(1,(now-start)/850);const eased=1-Math.pow(1-p,3);const n=target*eased;if(label==="Study time")setDisplay(`${Math.floor(n/60)}h ${Math.floor(n%60)}m`);else setDisplay(`${n.toFixed(label==="Practice accuracy"?1:0)}${label==="Practice accuracy"||label==="Syllabus coverage"?"%":label==="Learning streak"?" days":""}`);if(p<1)frame=requestAnimationFrame(step);};frame=requestAnimationFrame(step);return()=>{stopped=true;cancelAnimationFrame(frame);};},[label]);
 return <article className={`metric metric--${kind}`}><div className="metric-topline"><span className="metric-icon"><Icon size={18}/></span><span className="metric-index">{kind==="feature"?"01 / FOCUS":kind==="progress"?"04 / JOURNEY":"LIVE PREVIEW"}</span></div><div className="metric-copy"><p>{label}</p><strong className="metric-value-kinetic">{display}</strong><small>{detail}</small></div>{kind==="feature"&&<div className="metric-visual" aria-hidden="true"><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/></div>}{kind==="compact"&&<div className="metric-accent-line" aria-hidden="true"><span/></div>}{kind==="progress"&&<><div className="metric-progress" role="progressbar" aria-label="Syllabus coverage" aria-valuenow={32} aria-valuemin={0} aria-valuemax={100}><span className="metric-progress__fill" style={{width:"32%"}}/></div><div className="metric-milestone"><span>Foundation stage</span><b>32 of 100%</b></div></>}</article>;
}
function Home() {
 return <div className="stack">
  <section className="hero bento-hero" data-reveal="hero"><div className="hero-copy"><span className="eyebrow"><Sparkles size={13}/> YOUR LEARNING SPACE</span><h2>Your preparation,<br/><em>in focus.</em></h2><p>Bring classes, practice, study resources and progress into one focused workspace.</p><div className="hero-actions"><NavLink className="primary" to="/tests">Explore mock tests <ArrowRight size={15}/></NavLink><NavLink className="subtle-link" to="/library">Browse the library</NavLink></div></div><div className="hero-art"><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="core"><GraduationCap size={37}/></div><span className="spark spark-a"/><span className="spark spark-b"/></div></section>
  <div className="section-title" data-reveal="section"><div><h3>Learning overview</h3><p>A quick snapshot of your preparation</p></div><span className="tag">THIS WEEK <ChevronDown size={13}/></span></div>
  <section className="metrics bento-grid" data-reveal="grid"><Metric kind="feature" label="Study time" value="18h 40m" detail="Time invested this week · preview data" icon={Clock3}/><Metric kind="compact" label="Practice accuracy" value="78.4%" detail="Correct answers · preview data" icon={Target}/><Metric kind="compact" label="Learning streak" value="9 days" detail="Consecutive study days" icon={Activity}/><Metric kind="progress" label="Syllabus coverage" value="32%" detail="Learning journey milestone" icon={BookOpen}/></section>
  <section className="lower-grid bento-feature-grid" data-reveal="grid"><article className="panel"><div className="section-title"><div><h3>Suggested focus</h3><p>Example learning priorities</p></div><span className="tag">3 ITEMS</span></div>{[["01","Indian Polity","Constitutional framework · 35 min"],["02","Daily current affairs","National affairs · 20 min"],["03","Prelims practice","25 questions · 30 min"]].map(([n,t,d])=><div className="task" key={n}><b>{n}</b><div><strong>{t}</strong><small>{d}</small></div><span className="task-status">Planned</span></div>)}<NavLink className="footer-link" to="/tests">Explore practice <ArrowRight size={14}/></NavLink></article>
  <article className="panel learning-room-card"><div className="section-title"><div><h3>Learning room</h3><p>Live and recorded sessions</p></div><span className="live-tag">CLASSROOM</span></div><div className="class-art"><span>LEARN · PRACTISE · REVIEW</span><BookOpen size={35}/><strong>YOUR NEXT SESSION</strong></div><h4 className="class-heading">Your class schedule belongs here</h4><p className="class-description">Connect a class provider and publish sessions from the administration workspace.</p><NavLink className="primary wide" to="/classes">Open classes <ArrowRight size={14}/></NavLink></article></section>
  <section className="panel pulse" data-reveal="feature"><div className="section-title"><div><h3>Performance snapshot</h3><p>Preview only — connect the database before using real student metrics.</p></div><NavLink className="footer-link" to="/performance">View performance <ArrowRight size={14}/></NavLink></div><div className="pulse-grid"><div><small>Accuracy</small><strong>78.4%</strong></div><div><small>Attempt rate</small><strong>84%</strong></div><div><small>Consistency</small><strong>9 days</strong></div><div className="insight"><Sparkles size={16}/><span><b>Learning insight</b><small>Use reviewed test attempts to discover topics that need another revision.</small></span></div></div></section>
 </div>;
}
type LibraryItem = {
 id: string; title: string; summary: string; exam: string; paper: string;
 subject: string; topic: string; subtopic: string; type: string; language: string;
 updated: string; tags: string[]; body: unknown; externalUrl: string | null; storagePath: string | null;
};
function mapContentType(value: string) {
 const labels: Record<string,string> = { note:"Notes", pdf:"PDF", editorial:"Editorial", current_affairs:"Current Affairs", video:"Video", article:"Article", quiz:"Quiz", other:"Other" };
 return labels[value] ?? value;
}
function formatContentDate(value: string | null | undefined) {
 if (!value) return "Recently updated";
 const date = new Date(value);
 return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
}
function contentBodyText(value: unknown): string {
 if (typeof value === "string") return value;
 if (value && typeof value === "object") {
  const item=value as Record<string,unknown>;
  return [item.content,item.text,item.markdown,item.body].filter((part):part is string=>typeof part==="string").join("\\n\\n");
 }
 return "";
}
function LibraryPage() {
 const [query,setQuery]=useState("");
 const [exam,setExam]=useState("All exams");
 const [subject,setSubject]=useState("All subjects");
 const [kind,setKind]=useState("All formats");
 const [language,setLanguage]=useState("All languages");
 const [expanded,setExpanded]=useState("");
 const [items,setItems]=useState<LibraryItem[]>([]);
 const [loading,setLoading]=useState(true);
 const [loadError,setLoadError]=useState("");
 const [selected,setSelected]=useState<LibraryItem|null>(null);

 useEffect(()=>{
  let active=true;
  async function loadPublishedResources(){
   setLoading(true);setLoadError("");
   if(!supabase){if(active){setLoadError("Supabase is not configured. Check the Render environment variables and redeploy.");setItems([]);setLoading(false);}return;}
   try{
    const {data:institute,error:instituteError}=await supabase.from("institutes").select("id").eq("slug","newias").maybeSingle();
    if(instituteError)throw instituteError;
    if(!institute)throw new Error("The NewIAS institute record was not found in this Supabase project.");
    const {data,error}=await supabase.from("content_items")
     .select("id,title,summary,content_type,language,subject,topic,paper_code,content_date,updated_at,tags,metadata,body,external_url,storage_path")
     .eq("institute_id",institute.id).eq("status","published")
     .order("published_at",{ascending:false,nullsFirst:false}).order("updated_at",{ascending:false});
    if(error)throw error;
    const mapped:LibraryItem[]=(data??[]).map((row:any)=>{
     const metadata=(row.metadata&&typeof row.metadata==="object"?row.metadata:{}) as Record<string,unknown>;
     const exam=typeof metadata.exam==="string"?metadata.exam:(typeof metadata.exam_name==="string"?metadata.exam_name:"NewIAS");
     const subtopic=typeof metadata.subtopic==="string"?metadata.subtopic:"";
     const tags=Array.isArray(row.tags)?row.tags.filter((tag:unknown):tag is string=>typeof tag==="string"):[];
     return {id:String(row.id),title:row.title??"Untitled resource",summary:row.summary??"",exam,paper:row.paper_code??"",subject:row.subject??"Uncategorised",topic:row.topic??"General",subtopic,type:mapContentType(row.content_type??"other"),language:(row.language??"en").toLowerCase().startsWith("hi")?"Hindi":(row.language??"en").toLowerCase().startsWith("en")?"English":row.language??"Other",updated:formatContentDate(row.content_date??row.updated_at),tags,body:row.body,externalUrl:row.external_url??null,storagePath:row.storage_path??null};
    });
    if(active){setItems(mapped);setExpanded(mapped[0]?.subject??"");}
   }catch(error){
    console.error("NewIAS library load failed:",error);
    if(active){setItems([]);setLoadError(error instanceof Error?error.message:"Could not load published resources.");}
   }finally{if(active)setLoading(false);}
  }
  void loadPublishedResources();
  return()=>{active=false;};
 },[]);

 const subjects=Array.from(new Set([...items.map(item=>item.subject)])).sort((a,b)=>a.localeCompare(b));
 const formats=Array.from(new Set(items.map(item=>item.type))).sort();
 const exams=Array.from(new Set(items.map(item=>item.exam))).sort();
 const filtered=items.filter(item=>{
  const haystack=[item.title,item.summary,item.exam,item.paper,item.subject,item.topic,item.subtopic,...item.tags].join(" ").toLowerCase();
  return haystack.includes(query.toLowerCase())&&(exam==="All exams"||item.exam===exam)&&(subject==="All subjects"||item.subject===subject)&&(kind==="All formats"||item.type===kind)&&(language==="All languages"||item.language===language);
 });
 const grouped=filtered.reduce<Record<string,LibraryItem[]>>((groups,item)=>{(groups[item.subject]??=[]).push(item);return groups;},{});
 const resetFilters=()=>{setQuery("");setExam("All exams");setSubject("All subjects");setKind("All formats");setLanguage("All languages");};
 const bodyText=selected?contentBodyText(selected.body):"";
 return <div className="library-stack">
  <section className="library-banner"><div><span className="eyebrow"><BookOpen size={13}/> STRUCTURED KNOWLEDGE SPACE</span><h2>Less searching.<br/><em>More learning.</em></h2><p>Published resources from your NewIAS library, organised by subject, topic, format and language.</p></div><div className="library-count"><strong>{loading?"…":filtered.length.toString().padStart(2,"0")}</strong><span>matching resources</span><small>Live Supabase catalogue</small></div></section>
  <section className="library-controls library-filter-bento" aria-labelledby="library-filter-title">
   <div className="library-filter-heading"><div><span className="library-filter-kicker"><SlidersHorizontal size={13}/> DISCOVER & REFINE</span><h3 id="library-filter-title">Find your next resource<span>.</span></h3><p>Search across topics or narrow the library with four focused filters.</p></div><div className="library-filter-count"><strong>{filtered.length.toString().padStart(2,"0")}</strong><span>matching resources</span></div></div>
   <label className="library-search"><Search size={19} aria-hidden="true"/><input aria-label="Search resources by title, topic or keyword" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search title, topic or keyword…"/>{query&&<button type="button" onClick={()=>setQuery("")} aria-label="Clear search"><X size={16}/></button>}</label>
   <div className="filter-row"><label><span><b>01</b> EXAM</span><select aria-label="Filter by exam" value={exam} onChange={e=>setExam(e.target.value)}><option>All exams</option>{exams.map(value=><option key={value}>{value}</option>)}</select></label><label><span><b>02</b> SUBJECT</span><select aria-label="Filter by subject" value={subject} onChange={e=>setSubject(e.target.value)}><option>All subjects</option>{subjects.map(value=><option key={value}>{value}</option>)}</select></label><label><span><b>03</b> RESOURCE TYPE</span><select aria-label="Filter by resource type" value={kind} onChange={e=>setKind(e.target.value)}><option>All formats</option>{formats.map(value=><option key={value}>{value}</option>)}</select></label><label><span><b>04</b> LANGUAGE</span><select aria-label="Filter by language" value={language} onChange={e=>setLanguage(e.target.value)}><option>All languages</option><option>Hindi</option><option>English</option></select></label><button className="clear-filters library-reset-button" onClick={resetFilters}><X size={15}/> Reset filters</button></div>
  </section>
  <div className="library-results-head"><div><h3>Browse by subject</h3><p>Only published resources available to your signed-in account are shown.</p></div><span>{loading?"LOADING":Object.keys(grouped).length+" SUBJECT GROUPS"}</span></div>
  {loading?<section className="empty-library"><Sparkles size={24}/><strong>Loading your library…</strong><p>Fetching published resources from NewIAS.</p></section>
  :loadError?<section className="empty-library"><AlertCircle size={26}/><strong>We couldn’t load the library</strong><p>{loadError}</p><button onClick={()=>window.location.reload()}>Retry</button></section>
  :filtered.length===0?<section className="empty-library"><FileText size={26}/><strong>{items.length===0?"Your library is ready for content":"No resources match these filters"}</strong><p>{items.length===0?"No published resources were found. Publish a resource from Admin → Content Studio, then it will appear here.":"Try another subject, format or search term."}</p>{items.length>0&&<button onClick={resetFilters}>Clear all filters</button>}</section>
  :<div className="subject-groups">{Object.entries(grouped).map(([subjectName,subjectItems])=><section className="subject-group" key={subjectName}><button className="subject-group-head" onClick={()=>setExpanded(expanded===subjectName?"":subjectName)} aria-expanded={expanded===subjectName}><span className="subject-symbol"><Layers3 size={17}/></span><span className="subject-group-name"><strong>{subjectName}</strong><small>{Array.from(new Set(subjectItems.map(item=>item.topic))).length} topics · {subjectItems.length} resources</small></span><span className="group-exams">{Array.from(new Set(subjectItems.map(item=>item.exam))).join(" · ")}</span><ChevronDown className={expanded===subjectName?"group-chevron open":"group-chevron"} size={17}/></button>{expanded===subjectName&&<div className="topic-list">{Object.entries(subjectItems.reduce<Record<string,LibraryItem[]>>((groups,item)=>{(groups[item.topic]??=[]).push(item);return groups;},{})).map(([topic,topicItems])=><div className="topic-cluster" key={topic}><div className="topic-heading"><span/><strong>{topic}</strong><small>{topicItems.length} {topicItems.length===1?"resource":"resources"}</small></div><div className="resource-list">{topicItems.map(item=><article className="resource-card" key={item.id}><span className={"resource-type type-"+item.type.toLowerCase().replaceAll(" ","-")}>{item.type}</span><div className="resource-main"><h4>{item.title}</h4><p>{item.summary}</p><div className="resource-meta"><span>{item.exam}</span>{item.paper&&<><i>·</i><span>{item.paper}</span></>}<i>·</i><span>{item.language}</span><i>·</i><span>{item.updated}</span></div><div className="resource-tags">{item.tags.map(tag=><span key={tag}>{tag}</span>)}{item.subtopic&&<span className="subtopic-tag">{item.subtopic}</span>}</div></div><button className="resource-open" title="Open resource" onClick={()=>setSelected(item)}><ArrowRight size={16}/></button></article>)}</div></div>)}</div>}</section>)}</div>}
  <p className="library-footnote"><Sparkles size={13}/> Catalogue data is loaded live from the NewIAS Supabase project; only published resources are listed.</p>
  {selected&&<div role="presentation" onClick={()=>setSelected(null)} style={{position:"fixed",inset:0,zIndex:1000,background:"#160f1bcc",display:"grid",placeItems:"center",padding:16}}><section role="dialog" aria-modal="true" aria-labelledby="resource-dialog-title" onClick={event=>event.stopPropagation()} style={{width:"min(100%,760px)",maxHeight:"85dvh",overflow:"auto",background:"var(--surface, #fffdfb)",color:"var(--text, #382d31)",border:"1px solid var(--border, #eadce2)",borderRadius:20,padding:24,boxShadow:"0 24px 80px #0003"}}><div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"start"}}><div><span className="eyebrow">{selected.type} · {selected.language}</span><h2 id="resource-dialog-title" style={{marginTop:10}}>{selected.title}</h2><p>{selected.summary}</p></div><button className="clear-filters" onClick={()=>setSelected(null)} aria-label="Close resource">Close</button></div><div style={{marginTop:18,lineHeight:1.8,whiteSpace:"pre-wrap",overflowWrap:"anywhere"}}>{bodyText||"This resource does not contain readable text yet."}</div>{selected.externalUrl&&<p style={{marginTop:20}}><a href={selected.externalUrl} target="_blank" rel="noreferrer">Open resource link ↗</a></p>}{selected.storagePath&&<p className="library-footnote">File storage path: {selected.storagePath}. Signed download/view support will be added with the storage integration.</p>}</section></div>}
 </div>;
}

type TaxonomyNode = { name: string; topics: { name: string; subtopics: string[] }[] };
const taxonomy: Record<string, { papers: Record<string, TaxonomyNode[]> }> = {
 "UPSC CSE": { papers: {
  "Prelims — GS Paper I": [
   {name:"Current Affairs",topics:[{name:"राष्ट्रीय घटनाक्रम",subtopics:["सरकारी योजनाएँ एवं नीतियाँ","राष्ट्रीय संस्थाएँ एवं रिपोर्ट","पुरस्कार एवं महत्वपूर्ण दिवस"]},{name:"अंतरराष्ट्रीय घटनाक्रम",subtopics:["अंतरराष्ट्रीय संगठन","वैश्विक समझौते","द्विपक्षीय संबंध"]}]},
   {name:"इतिहास एवं संस्कृति",topics:[{name:"प्राचीन भारत",subtopics:["सिंधु सभ्यता","वैदिक काल","बौद्ध एवं जैन धर्म","मौर्य एवं गुप्त काल"]},{name:"मध्यकालीन भारत",subtopics:["दिल्ली सल्तनत","मुगल काल","भक्ति एवं सूफी आंदोलन"]},{name:"आधुनिक भारत",subtopics:["यूरोपीय आगमन","1857 का विद्रोह","राष्ट्रीय आंदोलन","संवैधानिक विकास"]},{name:"कला एवं संस्कृति",subtopics:["वास्तुकला","चित्रकला","नृत्य एवं संगीत","साहित्य एवं विरासत"]}]},
   {name:"भूगोल",topics:[{name:"भौतिक भूगोल",subtopics:["स्थलरूप","जलवायु","महासागर","भूकंप एवं ज्वालामुखी"]},{name:"भारत का भूगोल",subtopics:["नदी तंत्र","मृदा एवं कृषि","खनिज एवं ऊर्जा","जनसंख्या"]},{name:"विश्व भूगोल",subtopics:["महाद्वीप","प्राकृतिक संसाधन","औद्योगिक क्षेत्र"]}]},
   {name:"भारतीय राजव्यवस्था एवं शासन",topics:[{name:"संविधान",subtopics:["संवैधानिक विकास","प्रस्तावना","मौलिक अधिकार","DPSP एवं मौलिक कर्तव्य","संशोधन एवं मूल संरचना"]},{name:"राजनीतिक व्यवस्था",subtopics:["संसद एवं राज्य विधानमंडल","राष्ट्रपति एवं राज्यपाल","न्यायपालिका","संघवाद एवं स्थानीय शासन"]},{name:"शासन",subtopics:["पारदर्शिता एवं जवाबदेही","लोकनीति","अधिकार संबंधी मुद्दे"]}]},
   {name:"अर्थव्यवस्था एवं सामाजिक विकास",topics:[{name:"भारतीय अर्थव्यवस्था",subtopics:["राष्ट्रीय आय","मुद्रास्फीति","मौद्रिक एवं राजकोषीय नीति","बैंकिंग एवं वित्तीय प्रणाली"]},{name:"समावेशी विकास",subtopics:["गरीबी एवं बेरोजगारी","जनसांख्यिकी","सामाजिक क्षेत्र","सतत विकास"]}]},
   {name:"पर्यावरण एवं पारिस्थितिकी",topics:[{name:"पारिस्थितिकी",subtopics:["पारिस्थितिकी तंत्र","जैव विविधता","संरक्षित क्षेत्र"]},{name:"जलवायु एवं पर्यावरण",subtopics:["जलवायु परिवर्तन","प्रदूषण","अंतरराष्ट्रीय पर्यावरण समझौते"]}]},
   {name:"सामान्य विज्ञान एवं प्रौद्योगिकी",topics:[{name:"सामान्य विज्ञान",subtopics:["भौतिकी","रसायन विज्ञान","जीव विज्ञान","स्वास्थ्य एवं रोग"]},{name:"विज्ञान एवं तकनीक",subtopics:["अंतरिक्ष","जैव प्रौद्योगिकी","सूचना प्रौद्योगिकी एवं AI","रक्षा तकनीक"]}]}
  ],
  "Prelims — CSAT": [{name:"CSAT / General Studies Paper II",topics:[{name:"Comprehension",subtopics:["Passage comprehension","Main idea and inference"]},{name:"Reasoning एवं विश्लेषण",subtopics:["Logical reasoning","Analytical ability","Decision making"]},{name:"गणितीय योग्यता",subtopics:["संख्या पद्धति","प्रतिशत एवं अनुपात","औसत एवं समय-कार्य"]},{name:"Data Interpretation",subtopics:["तालिका एवं ग्राफ","चार्ट","Data sufficiency"]}] }],
  "Mains — GS Paper I": [{name:"भारतीय विरासत एवं संस्कृति",topics:[{name:"कला एवं संस्कृति",subtopics:["कला रूप","साहित्य","वास्तुकला"]}]},{name:"इतिहास",topics:[{name:"आधुनिक भारत",subtopics:["औपनिवेशिक शासन","राष्ट्रीय आंदोलन","स्वतंत्रता के बाद एकीकरण"]},{name:"विश्व इतिहास",subtopics:["औद्योगिक क्रांति","विश्व युद्ध","उपनिवेशवाद एवं पुनर्संरचना"]}]},{name:"समाज",topics:[{name:"भारतीय समाज",subtopics:["विविधता","महिला एवं जनसंख्या","गरीबी एवं शहरीकरण","वैश्वीकरण"]}]},{name:"भूगोल",topics:[{name:"विश्व एवं भारत का भूगोल",subtopics:["भौतिक विशेषताएँ","संसाधन वितरण","भू-भौतिक घटनाएँ"]}]}],
  "Mains — GS Paper II": [{name:"भारतीय राजव्यवस्था",topics:[{name:"संवैधानिक ढाँचा",subtopics:["संविधान एवं संशोधन","संघवाद","संवैधानिक संस्थाएँ"]}]},{name:"शासन एवं सामाजिक न्याय",topics:[{name:"शासन",subtopics:["नीतियाँ एवं क्रियान्वयन","ई-गवर्नेंस","नागरिक चार्टर"]},{name:"सामाजिक न्याय",subtopics:["स्वास्थ्य","शिक्षा","कमजोर वर्ग","कल्याणकारी योजनाएँ"]}]},{name:"अंतरराष्ट्रीय संबंध",topics:[{name:"भारत एवं विश्व",subtopics:["पड़ोसी देश","द्विपक्षीय संबंध","वैश्विक संस्थाएँ"]}]}],
  "Mains — GS Paper III": [{name:"अर्थव्यवस्था",topics:[{name:"विकास एवं नियोजन",subtopics:["विकास","रोजगार","समावेशी विकास"]},{name:"कृषि",subtopics:["फसल प्रणाली","सिंचाई","MSP एवं खाद्य सुरक्षा"]}]},{name:"विज्ञान एवं प्रौद्योगिकी",topics:[{name:"उभरती तकनीक",subtopics:["AI एवं साइबर सुरक्षा","अंतरिक्ष","जैव प्रौद्योगिकी"]}]},{name:"पर्यावरण एवं आपदा प्रबंधन",topics:[{name:"पर्यावरण",subtopics:["संरक्षण","प्रदूषण","जलवायु परिवर्तन"]},{name:"आपदा प्रबंधन",subtopics:["जोखिम न्यूनीकरण","तैयारी एवं प्रतिक्रिया"]}]},{name:"आंतरिक सुरक्षा",topics:[{name:"सुरक्षा चुनौतियाँ",subtopics:["साइबर सुरक्षा","सीमा प्रबंधन","आतंकवाद एवं संगठित अपराध"]}]}],
  "Mains — GS Paper IV": [{name:"नीतिशास्त्र एवं सत्यनिष्ठा",topics:[{name:"नैतिकता",subtopics:["नैतिक अवधारणाएँ","मानवीय मूल्य","अभिवृत्ति"]},{name:"लोक सेवा मूल्य",subtopics:["सत्यनिष्ठा","निष्पक्षता","जवाबदेही"]},{name:"केस स्टडी",subtopics:["हितों का टकराव","प्रशासनिक दुविधा","नैतिक निर्णय"]}]}],
  "Mains — Essay": [{name:"निबंध",topics:[{name:"विषयगत निबंध",subtopics:["सामाजिक","राजनीतिक","आर्थिक","विज्ञान एवं तकनीक"]}] }],
  "Qualifying Language Papers": [{name:"भाषा एवं संप्रेषण",topics:[{name:"English",subtopics:["Comprehension","Precis writing","Vocabulary and usage"]},{name:"भारतीय भाषा",subtopics:["बोधगम्यता","संक्षेपण","व्याकरण एवं शब्दावली","अनुवाद"]}]}],
  "Optional Subject": ["Agriculture","Animal Husbandry & Veterinary Science","Anthropology","Botany","Chemistry","Civil Engineering","Commerce & Accountancy","Economics","Electrical Engineering","Geography","Geology","History","Law","Management","Mathematics","Mechanical Engineering","Medical Science","Philosophy","Physics","Political Science & International Relations","Psychology","Public Administration","Sociology","Statistics","Zoology","Hindi Literature","English Literature","Sanskrit Literature","Bengali Literature","Tamil Literature","Telugu Literature","Urdu Literature","Kannada Literature","Marathi Literature","Gujarati Literature","Punjabi Literature","Odia Literature","Assamese Literature","Bodo Literature","Dogri Literature","Kashmiri Literature","Konkani Literature","Maithili Literature","Malayalam Literature","Manipuri Literature","Nepali Literature","Santhali Literature","Sindhi Literature"].map(name=>({name,topics:[{name:"Paper I & II",subtopics:["Syllabus topic 1","Syllabus topic 2","Faculty-defined subtopic"]}]}))
 }},
 "MPPSC": { papers: {
  "Prelims — General Studies": [
   {name:"मध्य प्रदेश का इतिहास, संस्कृति एवं साहित्य",topics:[{name:"इतिहास",subtopics:["प्राचीन एवं पुरातात्विक स्थल","मध्यकालीन इतिहास","आधुनिक इतिहास","स्वतंत्रता आंदोलन में मध्य प्रदेश"]},{name:"संस्कृति एवं साहित्य",subtopics:["जनजातीय संस्कृति","लोक कला एवं लोक साहित्य","मेले एवं त्योहार","प्रमुख व्यक्तित्व"]}]},
   {name:"मध्य प्रदेश का भूगोल",topics:[{name:"भौतिक भूगोल",subtopics:["स्थिति एवं विस्तार","नदी तंत्र","जलवायु","मृदा"]},{name:"संसाधन एवं अर्थव्यवस्था",subtopics:["खनिज","वन एवं जैव विविधता","कृषि","ऊर्जा एवं उद्योग"]}]},
   {name:"मध्य प्रदेश की राजनीति एवं प्रशासन",topics:[{name:"राज्य शासन",subtopics:["राज्यपाल एवं मंत्रिपरिषद","विधानसभा","स्थानीय स्वशासन","प्रशासनिक संरचना"]},{name:"राज्य योजनाएँ",subtopics:["प्रमुख कल्याणकारी योजनाएँ","बजट","राज्य संस्थाएँ"]}]},
   {name:"भारत का इतिहास एवं राष्ट्रीय आंदोलन",topics:[{name:"भारतीय इतिहास",subtopics:["प्राचीन भारत","मध्यकालीन भारत","आधुनिक भारत","राष्ट्रीय आंदोलन"]}]},
   {name:"भारत एवं विश्व का भूगोल",topics:[{name:"भूगोल",subtopics:["भौतिक भूगोल","भारत का भूगोल","विश्व संसाधन"]}]},
   {name:"भारतीय राजव्यवस्था एवं अर्थव्यवस्था",topics:[{name:"राजव्यवस्था",subtopics:["संविधान","संसद एवं न्यायपालिका","संवैधानिक संस्थाएँ"]},{name:"अर्थव्यवस्था",subtopics:["राष्ट्रीय आय","बैंकिंग","बजट एवं योजनाएँ"]}]},
   {name:"विज्ञान, पर्यावरण एवं स्वास्थ्य",topics:[{name:"सामान्य विज्ञान",subtopics:["भौतिकी","रसायन","जीव विज्ञान"]},{name:"पर्यावरण",subtopics:["पारिस्थितिकी","जैव विविधता","जलवायु परिवर्तन"]},{name:"स्वास्थ्य",subtopics:["पोषण","रोग","सार्वजनिक स्वास्थ्य"]}]},
   {name:"राष्ट्रीय एवं अंतरराष्ट्रीय समसामयिकी",topics:[{name:"समसामयिकी",subtopics:["राष्ट्रीय घटनाक्रम","अंतरराष्ट्रीय घटनाक्रम","पुरस्कार एवं रिपोर्ट"]}]},
   {name:"सूचना एवं संचार प्रौद्योगिकी",topics:[{name:"ICT",subtopics:["डिजिटल शासन","साइबर सुरक्षा","AI एवं उभरती तकनीक"]}]}
  ],
  "Prelims — Aptitude / CSAT": [{name:"योग्यता एवं तार्किक क्षमता",topics:[{name:"गणितीय योग्यता",subtopics:["प्रतिशत","अनुपात","औसत","समय एवं कार्य"]},{name:"तर्कशक्ति",subtopics:["श्रृंखला","न्यायवाक्य","दिशा एवं संबंध"]},{name:"बोधगम्यता एवं डेटा",subtopics:["Comprehension","तालिका एवं ग्राफ","Data interpretation"]}]}],
  "Mains — General Studies I": [{name:"इतिहास एवं संस्कृति",topics:[{name:"भारत एवं मध्य प्रदेश",subtopics:["इतिहास","संस्कृति","राष्ट्रीय आंदोलन"]}]},{name:"भूगोल",topics:[{name:"भारत एवं मध्य प्रदेश",subtopics:["भौतिक भूगोल","संसाधन","जनसंख्या"]}]},{name:"समाज",topics:[{name:"सामाजिक मुद्दे",subtopics:["समाज एवं विविधता","महिला एवं कमजोर वर्ग"]}]}],
  "Mains — General Studies II": [{name:"राजव्यवस्था एवं शासन",topics:[{name:"संविधान",subtopics:["संवैधानिक व्यवस्था","संघवाद","संस्थाएँ"]},{name:"लोक प्रशासन",subtopics:["प्रशासनिक सुधार","जवाबदेही","लोकनीति"]}]},{name:"अर्थव्यवस्था",topics:[{name:"भारतीय एवं राज्य अर्थव्यवस्था",subtopics:["विकास","कृषि","बजट एवं योजनाएँ"]}]},{name:"विज्ञान एवं प्रौद्योगिकी",topics:[{name:"विज्ञान",subtopics:["उभरती तकनीक","स्वास्थ्य","पर्यावरण"]}]}],
  "Mains — General Studies III": [{name:"मध्य प्रदेश विशेष अध्ययन",topics:[{name:"राज्य इतिहास एवं संस्कृति",subtopics:["राज्य की विरासत","जनजातियाँ","साहित्य एवं कला"]},{name:"राज्य भूगोल एवं अर्थव्यवस्था",subtopics:["नदी एवं संसाधन","कृषि एवं उद्योग","योजनाएँ"]}]},{name:"समसामयिकी एवं विश्लेषण",topics:[{name:"राष्ट्रीय एवं राज्य मुद्दे",subtopics:["शासन","अर्थव्यवस्था","विज्ञान एवं पर्यावरण"]}]}],
  "Mains — General Studies IV": [{name:"नैतिकता, व्यक्तित्व एवं केस स्टडी",topics:[{name:"नैतिकता",subtopics:["मूल्य","सत्यनिष्ठा","लोक सेवा"]},{name:"केस स्टडी",subtopics:["प्रशासनिक निर्णय","हितों का टकराव"]}]}],
  "Mains — General Hindi & Essay": [{name:"सामान्य हिंदी",topics:[{name:"भाषा",subtopics:["व्याकरण","शब्दावली","वाक्य शुद्धि"]},{name:"लेखन",subtopics:["संक्षेपण","अनुवाद","प्रारूप लेखन"]}]},{name:"निबंध",topics:[{name:"निबंध लेखन",subtopics:["मध्य प्रदेश","राष्ट्रीय मुद्दे","सामाजिक एवं आर्थिक विषय"]}]}],
  "Optional Subject (verify current notification)": ["Agriculture","Animal Husbandry & Veterinary Science","Anthropology","Botany","Chemistry","Civil Engineering","Commerce & Accountancy","Criminology & Forensic Science","Economics","Electrical Engineering","English Literature","Geography","Geology","Hindi Literature","History","Law","Mathematics","Mechanical Engineering","Military Science","Philosophy","Physics","Political Science & International Relations","Psychology","Public Administration","Sanskrit Literature","Sociology","Statistics","Urdu Literature","Zoology"].map(name=>({name,topics:[{name:"Subject modules",subtopics:["Paper topic 1","Paper topic 2","Faculty-defined subtopic"]}]}))
 }}
};
type DraftResource = {id:number;title:string;exam:string;paper:string;subject:string;topic:string;subtopic:string;type:string;language:string;status:string;updated:string};
function ContentStudio() {
 const [exam,setExam]=useState("UPSC CSE");
 const [paper,setPaper]=useState("GS Paper II");
 const [subject,setSubject]=useState("भारतीय राजव्यवस्था");
 const [topic,setTopic]=useState("संवैधानिक विकास");
 const [subtopic,setSubtopic]=useState("कंपनी शासन");
 const [title,setTitle]=useState("");
 const [summary,setSummary]=useState("");
 const [type,setType]=useState("note");
 const [language,setLanguage]=useState("Hindi");
 const [difficulty,setDifficulty]=useState("standard");
 const [source,setSource]=useState("");
 const [contentDate,setContentDate]=useState("2026-10-28");
 const [minutes,setMinutes]=useState("20");
 const [tags,setTags]=useState("Static, Prelims");
 const [syllabus,setSyllabus]=useState("");
 const [body,setBody]=useState("");
 const [notice,setNotice]=useState("");
 const [saved,setSaved]=useState<DraftResource[]>([]);
 const exams=Object.keys(taxonomy);
 const papers=Object.keys(taxonomy[exam]?.papers??{});
 const subjects=taxonomy[exam]?.papers[paper]??[];
 const topics=subjects.find(s=>s.name===subject)?.topics??[];
 const subtopics=topics.find(t=>t.name===topic)?.subtopics??[];
 const changeExam=(value:string)=>{setExam(value);const nextPaper=Object.keys(taxonomy[value].papers)[0];setPaper(nextPaper);const nextSubject=taxonomy[value].papers[nextPaper][0]?.name??"";setSubject(nextSubject);const nextTopic=taxonomy[value].papers[nextPaper][0]?.topics[0];setTopic(nextTopic?.name??"");setSubtopic(nextTopic?.subtopics[0]??"");};
 const changePaper=(value:string)=>{setPaper(value);const nextSubject=taxonomy[exam].papers[value][0];setSubject(nextSubject?.name??"");setTopic(nextSubject?.topics[0]?.name??"");setSubtopic(nextSubject?.topics[0]?.subtopics[0]??"");};
 const changeSubject=(value:string)=>{setSubject(value);const next=subjects.find(s=>s.name===value)?.topics[0];setTopic(next?.name??"");setSubtopic(next?.subtopics[0]??"");};
 const changeTopic=(value:string)=>{setTopic(value);setSubtopic(topics.find(t=>t.name===value)?.subtopics[0]??"");};
 const resetForm=()=>{setTitle("");setSummary("");setSource("");setBody("");setSyllabus("");setNotice("");};
 const saveResource=(publish:boolean)=>{if(!title.trim()){setNotice("Resource title is required before saving.");return;}if(!summary.trim()){setNotice("Add a short summary so students can understand this resource.");return;}const row:DraftResource={id:Date.now(),title:title.trim(),exam,paper,subject,topic,subtopic,type,language,status:publish?"Published":"Draft",updated:"Just now"};setSaved(prev=>[row,...prev]);setNotice(publish?"Preview record marked published. Database publishing is not connected yet.":"Draft saved in this browser session only. Connect Supabase to persist it.");};
 return <div className="studio-layout">
  <section className="studio-banner"><div><span className="eyebrow"><Layers3 size={13}/> TAXONOMY-AWARE PUBLISHING</span><h2>One resource.<br/><em>The right place.</em></h2><p>Assign structured metadata once. The library can organise the resource automatically by exam, paper, subject, topic and subtopic.</p></div><div className="studio-banner-stat"><strong>{saved.length.toString().padStart(2,"0")}</strong><span>session records</span><small>Not yet saved to database</small></div></section>
  <div className="studio-columns"><section className="studio-form-panel"><div className="studio-panel-heading"><div><h3><FileText size={16}/> Resource details</h3><p>Start with a clear title and a useful summary.</p></div><span className="draft-pill">CONTENT EDITOR</span></div>
   <div className="studio-field"><label htmlFor="resource-title">Resource title <b>*</b></label><input id="resource-title" value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. भारतीय संविधान का विकास"/><small>Use a descriptive title students can search for.</small></div>
   <div className="studio-field"><label htmlFor="resource-summary">Short summary <b>*</b></label><textarea id="resource-summary" rows={3} value={summary} onChange={e=>setSummary(e.target.value)} placeholder="What will a learner understand after studying this resource?"/></div>
   <div className="studio-field"><label htmlFor="resource-body">Content / editor body</label><textarea id="resource-body" rows={5} value={body} onChange={e=>setBody(e.target.value)} placeholder="Paste or write note content here. Rich editor and file upload can be added to this field in the next pass."/></div>
   <div className="studio-field"><label htmlFor="resource-source">Source / attribution</label><input id="resource-source" value={source} onChange={e=>setSource(e.target.value)} placeholder="e.g. Official report, newspaper, faculty notes"/></div>
   <div className="studio-form-actions"><button className="studio-secondary" onClick={()=>{resetForm();setNotice("Form cleared.");}}>Clear form</button><button className="studio-secondary" onClick={()=>saveResource(false)}><Save size={14}/> Save draft</button><button className="studio-publish" onClick={()=>saveResource(true)}><Send size={14}/> Publish preview</button></div>
   {notice&&<div className={"studio-notice"+(notice.includes("required")||notice.includes("Add a short")?" error":"")}><AlertCircle size={15}/><span>{notice}</span></div>}
  </section>
  <section className="studio-form-panel taxonomy-panel"><div className="studio-panel-heading"><div><h3><Layers3 size={16}/> Taxonomy & metadata</h3><p>Choose the hierarchy; child options update automatically.</p></div><span className="required-note">* Required</span></div>
   <div className="taxonomy-path"><span>{exam}</span><ArrowRight size={12}/><span>{paper}</span><ArrowRight size={12}/><span>{subject}</span><ArrowRight size={12}/><span>{topic}</span></div>
   <div className="studio-field"><label htmlFor="tax-exam">Exam / track <b>*</b></label><select id="tax-exam" value={exam} onChange={e=>changeExam(e.target.value)}>{exams.map(v=><option key={v}>{v}</option>)}</select></div>
   <div className="studio-field"><label htmlFor="tax-paper">Paper / course segment <b>*</b></label><select id="tax-paper" value={paper} onChange={e=>changePaper(e.target.value)}>{papers.map(v=><option key={v}>{v}</option>)}</select></div>
   <div className="studio-field"><label htmlFor="tax-subject">Subject <b>*</b></label><select id="tax-subject" value={subject} onChange={e=>changeSubject(e.target.value)}>{subjects.map(v=><option key={v.name}>{v.name}</option>)}</select></div>
   <div className="studio-field"><label htmlFor="tax-topic">Topic <b>*</b></label><select id="tax-topic" value={topic} onChange={e=>changeTopic(e.target.value)}>{topics.map(v=><option key={v.name}>{v.name}</option>)}</select></div>
   <div className="studio-field"><label htmlFor="tax-subtopic">Subtopic</label><select id="tax-subtopic" value={subtopic} onChange={e=>setSubtopic(e.target.value)}>{subtopics.map(v=><option key={v}>{v}</option>)}</select></div>
   <div className="studio-two-fields"><div className="studio-field"><label htmlFor="tax-type">Format</label><select id="tax-type" value={type} onChange={e=>setType(e.target.value)}><option value="note">Notes</option><option value="pdf">PDF</option><option value="editorial">Editorial</option><option value="current_affairs">Current affairs</option><option value="video">Video</option><option value="quiz">Quiz</option><option value="article">Article</option></select></div><div className="studio-field"><label htmlFor="tax-language">Language</label><select id="tax-language" value={language} onChange={e=>setLanguage(e.target.value)}><option>Hindi</option><option>English</option><option>Bilingual</option></select></div></div>
   <div className="studio-two-fields"><div className="studio-field"><label htmlFor="tax-difficulty">Difficulty</label><select id="tax-difficulty" value={difficulty} onChange={e=>setDifficulty(e.target.value)}><option value="foundation">Foundation</option><option value="standard">Standard</option><option value="advanced">Advanced</option></select></div><div className="studio-field"><label htmlFor="tax-minutes">Study time (min)</label><input id="tax-minutes" type="number" min="0" value={minutes} onChange={e=>setMinutes(e.target.value)}/></div></div>
   <div className="studio-two-fields"><div className="studio-field"><label htmlFor="tax-date">Content date</label><input id="tax-date" type="date" value={contentDate} onChange={e=>setContentDate(e.target.value)}/></div><div className="studio-field"><label htmlFor="tax-syllabus">Syllabus code</label><input id="tax-syllabus" value={syllabus} onChange={e=>setSyllabus(e.target.value)} placeholder="e.g. GS2-01"/></div></div>
   <div className="studio-field"><label htmlFor="tax-tags">Tags</label><div className="tag-input-wrap"><Tags size={14}/><input id="tax-tags" value={tags} onChange={e=>setTags(e.target.value)} placeholder="Static, Prelims, Revision"/></div><small>Separate tags with commas.</small></div>
   <div className="metadata-preview"><span><CheckCircle2 size={14}/> Metadata preview</span><div>{[exam,paper,subject,topic,subtopic,type,language,difficulty,...tags.split(",").map(t=>t.trim()).filter(Boolean)].filter(Boolean).map((v,i)=><b key={v+i}>{v}</b>)}</div><small>These values become database fields after backend persistence is enabled.</small></div>
  </section></div>
  <div className="studio-import-grid"><CsvImporter/><PdfUploader/></div>
  <section className="studio-saved"><div className="studio-panel-heading"><div><h3>Recently created in this session</h3><p>Local preview records — refresh clears these until Supabase is connected.</p></div><span className="draft-pill">{saved.length} ITEMS</span></div>{saved.length===0?<div className="studio-empty"><FileText size={22}/><strong>No resources created yet</strong><span>Fill the form and save a draft or publish a preview.</span></div>:<div className="studio-saved-list">{saved.map(item=><article className="studio-saved-item" key={item.id}><span className="saved-file"><FileText size={17}/></span><div className="saved-item-copy"><strong>{item.title}</strong><small>{item.exam} · {item.paper} · {item.subject} / {item.topic} / {item.subtopic}</small></div><span className={item.status==="Published"?"saved-status published":"saved-status"}>{item.status}</span></article>)}</div>}</section>
 </div>;
}
function Placeholder({title,subtitle,admin:staff}:{title:string;subtitle:string;admin:boolean}) {
 return <section className="placeholder"><div className="placeholder-icon">{staff?<Settings2 size={26}/>:<GraduationCap size={26}/>}</div><span className="eyebrow">{staff?"ADMINISTRATION WORKSPACE":"STUDENT WORKSPACE"}</span><h2>{title}</h2><p>{subtitle}</p><div className="divider"/><span className="ready"><CheckCircle2 size={15}/> Route is ready for implementation</span><p className="note">This page is currently a UI foundation. Live data, authentication, permissions and module-specific workflows must be connected before production use.</p></section>;
}

function AuthScreen() {
 const [mode,setMode]=useState<"signin"|"signup">("signin");
 const [email,setEmail]=useState("");
 const [password,setPassword]=useState("");
 const [busy,setBusy]=useState(false);
 const [notice,setNotice]=useState("");
 const [error,setError]=useState("");
 const configured=Boolean(supabase);
 const submit=async(e:FormEvent<HTMLFormElement>)=>{
  e.preventDefault();setError("");setNotice("");
  if(!supabase){setError("Authentication is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the Render environment settings.");return;}
  setBusy(true);
  try{
   if(mode==="signup"&&email.trim().toLowerCase()===ADMIN_EMAIL.toLowerCase()){throw new Error("The administrator account must be created or invited from the Supabase Dashboard. Sign in here after it has been provisioned.");}
   if(mode==="signin"){
    const {error}=await supabase.auth.signInWithPassword({email:email.trim(),password});
    if(error)throw error;
   }else{
    const {data,error}=await supabase.auth.signUp({email:email.trim(),password,options:{emailRedirectTo:window.location.origin}});
    if(error)throw error;
    if(!data.session)setNotice("Account created. Check your email to confirm the account, then sign in.");
   }
  }catch(err){setError(err instanceof Error?err.message:"Authentication failed. Please try again.");}
  finally{setBusy(false);}
 };
 return <main className="auth-screen" data-theme="light">
  <section className="auth-card">
   <div className="auth-brand"><span className="auth-brand-mark"><GraduationCap size={26}/></span><div><b>New<span>IAS</span></b><small>CIVIL SERVICES LEARNING</small></div></div>
   <span className="auth-kicker">YOUR LEARNING SPACE</span>
   <h1>{mode==="signin"?"Welcome back.":"Start your preparation."}</h1>
   <p className="auth-intro">{mode==="signin"?"Sign in to continue your learning journey.":"Create your learner account to access study resources and practice."}</p>
   {!configured&&<div className="auth-alert" role="alert"><AlertCircle size={17}/><span>Authentication setup required. Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to Render before accounts can sign in.</span></div>}
   <form onSubmit={submit} className="auth-form">
    <label>Email address<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label>
    <label>Password<input type="password" autoComplete={mode==="signin"?"current-password":"new-password"} minLength={6} required value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 6 characters"/></label>
    {error&&<p className="auth-error" role="alert">{error}</p>}
    {notice&&<p className="auth-notice" role="status">{notice}</p>}
    <button className="auth-submit" type="submit" disabled={busy||!configured}>{busy?"Please wait…":mode==="signin"?"Sign in securely":"Create account"}<ArrowRight size={17}/></button>
   </form>
   <p className="auth-switch">{mode==="signin"?"New to NewIAS?":"Already have an account?"} <button onClick={()=>{setMode(mode==="signin"?"signup":"signin");setError("");setNotice("");}}>{mode==="signin"?"Create an account":"Sign in"}</button></p>
   <div className="auth-security"><ShieldCheck size={16}/><span>Admin access is reserved for <b>{ADMIN_EMAIL}</b>. All other accounts enter the student workspace.</span></div>
  </section>
 </main>;
}

export default function App() {
 const [open,setOpen]=useState(false);
 const [dockHidden,setDockHidden]=useState(false);
 const [authUser,setAuthUser]=useState<User|null>(null);
 const [authLoading,setAuthLoading]=useState(true);
 const [roleLoading,setRoleLoading]=useState(true);
 const [membershipRole,setMembershipRole]=useState<string|null>(null);
 const navigate=useNavigate();
 const loc=useLocation();
 const isAdmin=membershipRole==="admin"||isAdminEmail(authUser?.email);
 useEffect(()=>{
  let lastY=window.scrollY;
  let ticking=false;
  const onScroll=()=>{
   if(ticking)return;
   ticking=true;
   window.requestAnimationFrame(()=>{
    const currentY=window.scrollY;
    const delta=currentY-lastY;
    if(Math.abs(delta)>7){
     if(currentY<80||delta<0)setDockHidden(false);
     else if(delta>0)setDockHidden(true);
     lastY=currentY;
    }
    ticking=false;
   });
  };
  window.addEventListener("scroll",onScroll,{passive:true});
  return()=>window.removeEventListener("scroll",onScroll);
 },[]);

 useEffect(()=>{if(!supabase){setAuthLoading(false);setRoleLoading(false);return;}let active=true;supabase.auth.getSession().then(({data})=>{if(active){setAuthUser(data.session?.user??null);setAuthLoading(false);}}).catch(()=>{if(active)setAuthLoading(false);});const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{setAuthUser(session?.user??null);setAuthLoading(false);});return()=>{active=false;subscription.unsubscribe();};},[]);
 useEffect(()=>{
  let active=true;
  async function resolveRole(){
   if(!authUser){setMembershipRole(null);setRoleLoading(false);return;}
   const configuredAdmin=isAdminEmail(authUser.email);
   if(configuredAdmin&&active)setMembershipRole("admin");
   else if(active)setMembershipRole(null);
   if(!supabase){if(active)setRoleLoading(false);return;}
   setRoleLoading(true);
   try{
    const {data:institute,error:instituteError}=await supabase.from("institutes").select("id").eq("slug","newias").maybeSingle();
    if(instituteError)throw instituteError;
    if(!institute){if(active&&!configuredAdmin)setMembershipRole(null);return;}
    const {data:membership,error:membershipError}=await supabase.from("institute_memberships").select("role,status").eq("institute_id",institute.id).eq("user_id",authUser.id).eq("status","active").maybeSingle();
    if(membershipError)throw membershipError;
    if(active)setMembershipRole(membership?.role==="admin"||configuredAdmin?"admin":membership?.role??null);
   }catch(error){console.error("Could not resolve NewIAS membership role:",error);if(active&&!configuredAdmin)setMembershipRole(null);}
   finally{if(active)setRoleLoading(false);}
  }
  void resolveRole();
  return()=>{active=false;};
 },[authUser]);
 useEffect(()=>{if(authUser&&!isAdmin&&loc.pathname.startsWith("/admin"))navigate("/",{replace:true});},[authUser,isAdmin,loc.pathname,navigate]);
 const [theme,setTheme]=useState<"light"|"dark">(()=>{try{return localStorage.getItem("newias-theme")==="dark"?"dark":"light";}catch{return "light";}});
 useEffect(()=>{try{localStorage.setItem("newias-theme",theme);}catch{}},[theme]);
 const page=loc.pathname.startsWith("/tests/attempt/")?{title:"Assessment",subtitle:"Answer questions, review responses and submit your attempt."}:pages[loc.pathname]??{title:"Page not found",subtitle:"This route is not available."};
 useEffect(()=>{const root=document.querySelector(".app-shell");if(!root)return;const targets=root.querySelectorAll("[data-reveal],.p1-banner,.p1-card,.p1-panel,.p360-hero,.p360-panel,.p360-attempt-list > *, .p2-hero,.p2-panel,.p2-resource,.p2-library-card,.import-panel,.pdf-drop,.assessment-result,.assessment-question-panel,.assessment-navigator,.studio-panel,.studio-saved,.panel,.metric");if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){targets.forEach(el=>el.classList.add("is-visible"));return;}root.classList.add("reveal-ready");const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}});},{threshold:0.12,rootMargin:"0px 0px -35px 0px"});targets.forEach(el=>observer.observe(el));return()=>observer.disconnect();},[loc.pathname]);
 const renderNav=(items:NavItem[],label:string)=><div className="nav-group" key={label}><span className="nav-heading">{label}</span>{items.map(({to,label:item,icon:Icon})=><NavLink end={to==="/"} key={to} to={to} onClick={()=>setOpen(false)} className={({isActive})=>"nav-link"+(isActive?" active":"")}><Icon size={17}/><span>{item}</span></NavLink>)}</div>;
 if(authLoading||roleLoading)return <main className="auth-screen"><section className="auth-card auth-loading"><span className="auth-brand-mark"><GraduationCap size={26}/></span><h1>Preparing your workspace…</h1><p>Checking your secure session.</p></section></main>;
 if(!authUser)return <AuthScreen/>;
 return <div className="app-shell" data-theme={theme}>{open&&<button className="backdrop" aria-label="Close navigation" onClick={()=>setOpen(false)}/>}<aside className={"sidebar"+(open?" sidebar-open":"")}><div className="brand"><div className="brand-mark"><GraduationCap size={22}/></div><div className="brand-name">New<span>IAS</span><small>CIVIL SERVICES LEARNING</small></div><button className="close-menu" aria-label="Close menu" onClick={()=>setOpen(false)}><X size={17}/></button></div><div className="workspace"><span>N</span><div><b>NewIAS Academy</b><small>Learning workspace</small></div><ChevronDown size={14}/></div><nav>{renderNav(student,"LEARNING")}{isAdmin&&renderNav(admin,"ADMINISTRATION")}</nav><div className="sidebar-bottom"><div className="help"><b>Learning support</b><p>Keep classes, resources and practice in one place.</p><NavLink to="/library" onClick={()=>setOpen(false)}>Explore resources <ArrowRight size={12}/></NavLink></div><div className="account"><span>{(authUser.email??"U").slice(0,1).toUpperCase()}</span><div><b>{isAdmin?"Administrator":"Student account"}</b><small>{authUser.email}</small></div><button className="signout-button" onClick={async()=>{await supabase?.auth.signOut();navigate("/",{replace:true});}} aria-label="Sign out" title="Sign out"><LogOut size={15}/></button></div></div></aside>
 <main className="main"><header className="topbar"><div className="crumb"><button className="mobile-menu" aria-label="Open navigation" onClick={()=>setOpen(true)}><Menu size={19}/></button><span>Workspace</span><i>/</i><b>{page.title}</b></div><div className="top-actions"><button className="search" onClick={()=>window.alert("Search will be enabled when the content index is connected.")}><Search size={15}/><span>Search resources...</span><kbd>⌘ K</kbd></button><button className="theme-toggle" onClick={()=>setTheme(current=>current==="light"?"dark":"light")} aria-label={theme==="light"?"Switch to Midnight Rose dark mode":"Switch to Rose Gold light mode"} title={theme==="light"?"Midnight Rose dark mode":"Rose Gold light mode"}>{theme==="light"?<Moon size={16}/>:<Sun size={16}/>}<span>{theme==="light"?"Dark":"Light"}</span></button><button className="bell" aria-label="Notifications"><Bell size={17}/></button><span className="avatar">N</span></div></header><div className="content"><div className="page-intro"><div><small>NEWIAS / {loc.pathname==="/"?"OVERVIEW":loc.pathname.slice(1).replaceAll("/"," / ").toUpperCase()}</small><h1>{page.title}</h1><p>{page.subtitle}</p></div><span className="study-chip"><CalendarDays size={14}/> Learning workspace</span></div><Routes><Route path="/" element={<Home/>}/><Route path="/classes" element={<ClassesPage/>}/><Route path="/tests" element={<TestsPage/>}/><Route path="/tests/attempt/:testId" element={<AssessmentEngine/>}/><Route path="/performance" element={isAdmin?<Performance360 isAdmin/>:<Performance360 isAdmin={false}/>}/><Route path="/admin" element={isAdmin?<AdminOverview/>:<Navigate to="/" replace/>}/><Route path="/admin/content" element={isAdmin?<ContentStudio/>:<Navigate to="/" replace/>}/><Route path="/admin/cms" element={isAdmin?<Phase2Cms/>:<Navigate to="/" replace/>}/><Route path="/library/workspace" element={<Phase2Library/>}/><Route path="/admin/students" element={isAdmin?<StudentsPage/>:<Navigate to="/" replace/>}/><Route path="/admin/classes" element={isAdmin?<ClassManagement/>:<Navigate to="/" replace/>}/><Route path="/admin/settings" element={isAdmin?<SettingsPage/>:<Navigate to="/" replace/>}/><Route path="/library" element={<LibraryPage/>}/><Route path="*" element={<Placeholder title="Page not found" subtitle="Choose a route from the navigation." admin={false}/>}/></Routes><footer><span>© 2026 NewIAS</span><span><i/> Independent project · preview data only</span></footer></div><nav className={"mobile-bottom-nav"+(dockHidden?" mobile-bottom-nav--hidden":"")} aria-label="Primary navigation">{student.map(({to,label,icon:Icon})=><NavLink key={to} to={to} end={to==="/"} aria-label={label} title={label} className={({isActive})=>"mobile-bottom-link"+(isActive?" active":"")}><Icon size={22} strokeWidth={1.8} aria-hidden="true"/><span>{label}</span></NavLink>)}</nav></main></div>;
}