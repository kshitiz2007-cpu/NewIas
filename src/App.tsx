import { useState } from "react";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import { Activity, ArrowRight, Bell, BookOpen, CalendarDays, CheckCircle2, ChevronDown, Clock3, FileText, GraduationCap, LayoutDashboard, Layers3, LibraryBig, Menu, PlayCircle, Search, Settings2, ShieldCheck, Sparkles, Target, Users, X, Save, Send, Tags, AlertCircle } from "lucide-react";

type NavItem = { to: string; label: string; icon: typeof Activity };
const student: NavItem[] = [
 {to:"/",label:"Overview",icon:LayoutDashboard},
 {to:"/classes",label:"Live & recorded classes",icon:PlayCircle},
 {to:"/tests",label:"Mock test centre",icon:Target},
 {to:"/library",label:"Digital library",icon:LibraryBig},
 {to:"/performance",label:"360° performance",icon:Activity}
];
const admin: NavItem[] = [
 {to:"/admin",label:"Admin overview",icon:ShieldCheck},
 {to:"/admin/content",label:"Content studio",icon:FileText},
 {to:"/admin/students",label:"Students & batches",icon:Users},
 {to:"/admin/classes",label:"Class management",icon:CalendarDays},
 {to:"/admin/settings",label:"Platform settings",icon:Settings2}
];
const pages: Record<string,{title:string;subtitle:string}> = {
 "/":{title:"Your preparation, in focus.",subtitle:"A clearer path from daily effort to exam readiness."},
 "/classes":{title:"Live & recorded classes",subtitle:"Discover your timetable, join sessions and revisit recordings."},
 "/tests":{title:"Mock test centre",subtitle:"Practise under exam conditions and learn from every attempt."},
 "/library":{title:"Digital library",subtitle:"Find notes, current affairs, editorials and reference material."},
 "/performance":{title:"360° performance",subtitle:"Track your progress, identify gaps and plan what to improve."},
 "/admin":{title:"Institute overview",subtitle:"A central workspace for academic delivery and operations."},
 "/admin/content":{title:"Content studio",subtitle:"Create, organise, review and publish learning resources."},
 "/admin/students":{title:"Students & batches",subtitle:"Manage learners, cohorts, enrolments and academic progress."},
 "/admin/classes":{title:"Class management",subtitle:"Schedule sessions and configure supported video providers."},
 "/admin/settings":{title:"Platform settings",subtitle:"Manage institute configuration and access policies."}
};
function Metric({label,value,detail,icon:Icon}:{label:string;value:string;detail:string;icon:typeof Activity}) {
 return <article className="metric"><span className="metric-icon"><Icon size={18}/></span><p>{label}</p><strong>{value}</strong><small>{detail}</small></article>;
}
function Home() {
 return <div className="stack">
  <section className="hero"><div className="hero-copy"><span className="eyebrow"><Sparkles size={13}/> YOUR LEARNING SPACE</span><h2>Build your edge.<br/><em>One day at a time.</em></h2><p>Bring classes, practice, study resources and progress into one focused workspace.</p><div className="hero-actions"><NavLink className="primary" to="/tests">Explore mock tests <ArrowRight size={15}/></NavLink><NavLink className="subtle-link" to="/library">Browse the library</NavLink></div></div><div className="hero-art"><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="core"><GraduationCap size={37}/></div><span className="spark spark-a"/><span className="spark spark-b"/></div></section>
  <div className="section-title"><div><h3>Learning overview</h3><p>A quick snapshot of your preparation</p></div><span className="tag">THIS WEEK <ChevronDown size={13}/></span></div>
  <section className="metrics"><Metric label="Study time" value="18h 40m" detail="Illustrative preview data" icon={Clock3}/><Metric label="Practice accuracy" value="78.4%" detail="Illustrative preview data" icon={Target}/><Metric label="Learning streak" value="9 days" detail="Illustrative preview data" icon={Activity}/><Metric label="Syllabus coverage" value="32%" detail="Illustrative preview data" icon={BookOpen}/></section>
  <section className="lower-grid"><article className="panel"><div className="section-title"><div><h3>Suggested focus</h3><p>Example learning priorities</p></div><span className="tag">3 ITEMS</span></div>{[["01","Indian Polity","Constitutional framework · 35 min"],["02","Daily current affairs","National affairs · 20 min"],["03","Prelims practice","25 questions · 30 min"]].map(([n,t,d])=><div className="task" key={n}><b>{n}</b><div><strong>{t}</strong><small>{d}</small></div><span className="task-status">Planned</span></div>)}<NavLink className="footer-link" to="/tests">Explore practice <ArrowRight size={14}/></NavLink></article>
  <article className="panel"><div className="section-title"><div><h3>Learning room</h3><p>Live and recorded sessions</p></div><span className="live-tag">CLASSROOM</span></div><div className="class-art"><span>LEARN · PRACTISE · REVIEW</span><BookOpen size={35}/><strong>YOUR NEXT SESSION</strong></div><h4 className="class-heading">Your class schedule belongs here</h4><p className="class-description">Connect a class provider and publish sessions from the administration workspace.</p><NavLink className="primary wide" to="/classes">Open classes <ArrowRight size={14}/></NavLink></article></section>
  <section className="panel pulse"><div className="section-title"><div><h3>Performance snapshot</h3><p>Preview only — connect the database before using real student metrics.</p></div><NavLink className="footer-link" to="/performance">View performance <ArrowRight size={14}/></NavLink></div><div className="pulse-grid"><div><small>Accuracy</small><strong>78.4%</strong></div><div><small>Attempt rate</small><strong>84%</strong></div><div><small>Consistency</small><strong>9 days</strong></div><div className="insight"><Sparkles size={16}/><span><b>Learning insight</b><small>Use reviewed test attempts to discover topics that need another revision.</small></span></div></div></section>
 </div>;
}
type LibraryItem = {
 id: number; title: string; summary: string; exam: string; paper: string;
 subject: string; topic: string; subtopic: string; type: string; language: string;
 updated: string; tags: string[];
};
const libraryItems: LibraryItem[] = [
 {id:1,title:"भारतीय संविधान का विकास",summary:"Regulating Act से Indian Independence Act तक संवैधानिक विकास की क्रमबद्ध व्याख्या।",exam:"UPSC CSE",paper:"GS Paper II",subject:"भारतीय राजव्यवस्था",topic:"संवैधानिक विकास",subtopic:"कंपनी शासन",type:"Notes",language:"Hindi",updated:"28 Oct 2026",tags:["Static","Prelims","Timeline"]},
 {id:2,title:"मौलिक अधिकार: अनुच्छेद 12–35",summary:"अनुच्छेदवार सार, महत्वपूर्ण निर्णय और Prelims के लिए तथ्य।",exam:"UPSC CSE",paper:"GS Paper II",subject:"भारतीय राजव्यवस्था",topic:"मौलिक अधिकार",subtopic:"संवैधानिक प्रावधान",type:"Notes",language:"Hindi",updated:"27 Oct 2026",tags:["Static","Prelims","Mains"]},
 {id:3,title:"DPSP और मौलिक कर्तव्य",summary:"भाग IV और IVA की तुलनात्मक समझ तथा प्रमुख संवैधानिक संशोधन।",exam:"UPSC CSE",paper:"GS Paper II",subject:"भारतीय राजव्यवस्था",topic:"राज्य के नीति-निदेशक तत्व",subtopic:"तुलनात्मक अध्ययन",type:"PDF",language:"Hindi",updated:"25 Oct 2026",tags:["Static","Revision"]},
 {id:4,title:"आज का संपादकीय विश्लेषण",summary:"मुख्य तर्क, पृष्ठभूमि, GS linkage और Mains answer enrichment points।",exam:"UPSC CSE",paper:"GS Paper II",subject:"Current Affairs",topic:"शासन एवं नीति",subtopic:"समसामयिक विश्लेषण",type:"Editorial",language:"Hindi",updated:"28 Oct 2026",tags:["Daily","Mains"]},
 {id:5,title:"मौद्रिक नीति और RBI",summary:"Repo rate, liquidity tools और inflation targeting की अवधारणाएँ।",exam:"UPSC CSE",paper:"GS Paper III",subject:"भारतीय अर्थव्यवस्था",topic:"मौद्रिक नीति",subtopic:"RBI के उपकरण",type:"Notes",language:"Hindi",updated:"24 Oct 2026",tags:["Static","Prelims"]},
 {id:6,title:"जलवायु परिवर्तन: मूल अवधारणाएँ",summary:"Mitigation, adaptation, carbon markets और भारत की प्रतिबद्धताएँ।",exam:"UPSC CSE",paper:"GS Paper III",subject:"पर्यावरण एवं पारिस्थितिकी",topic:"जलवायु परिवर्तन",subtopic:"वैश्विक समझौते",type:"Video",language:"English",updated:"22 Oct 2026",tags:["Static","Concept"]},
 {id:7,title:"मध्य प्रदेश की नदियाँ",summary:"उद्गम, प्रवाह, सहायक नदियाँ और परीक्षा उपयोगी मानचित्र-आधारित तथ्य।",exam:"MPPSC",paper:"State Specific",subject:"मध्य प्रदेश विशेष",topic:"भौतिक भूगोल",subtopic:"नदी तंत्र",type:"Notes",language:"Hindi",updated:"26 Oct 2026",tags:["State PCS","Map"]},
 {id:8,title:"दैनिक करेंट अफेयर्स क्विज़",summary:"आज की प्रमुख घटनाओं पर आधारित अभ्यास प्रश्न।",exam:"UPSC CSE",paper:"Prelims",subject:"Current Affairs",topic:"दैनिक समाचार",subtopic:"राष्ट्रीय एवं अंतरराष्ट्रीय",type:"Quiz",language:"Hindi",updated:"28 Oct 2026",tags:["Daily","Practice"]}
];
function LibraryPage() {
 const [query,setQuery]=useState("");
 const [exam,setExam]=useState("All exams");
 const [subject,setSubject]=useState("All subjects");
 const [kind,setKind]=useState("All formats");
 const [language,setLanguage]=useState("All languages");
 const [expanded,setExpanded]=useState<string>("भारतीय राजव्यवस्था");
 const subjects=Array.from(new Set(libraryItems.map(item=>item.subject)));
 const filtered=libraryItems.filter(item=>{
  const haystack=[item.title,item.summary,item.exam,item.paper,item.subject,item.topic,item.subtopic,...item.tags].join(" ").toLowerCase();
  return haystack.includes(query.toLowerCase())&&(exam==="All exams"||item.exam===exam)&&(subject==="All subjects"||item.subject===subject)&&(kind==="All formats"||item.type===kind)&&(language==="All languages"||item.language===language);
 });
 const grouped=filtered.reduce<Record<string,LibraryItem[]>>((groups,item)=>{(groups[item.subject]??=[]).push(item);return groups;},{});
 return <div className="library-stack">
  <section className="library-banner"><div><span className="eyebrow"><BookOpen size={13}/> STRUCTURED KNOWLEDGE SPACE</span><h2>Less searching.<br/><em>More learning.</em></h2><p>Every resource is organised by exam, paper, subject, topic, format and language — so a growing library stays navigable.</p></div><div className="library-count"><strong>{filtered.length.toString().padStart(2,"0")}</strong><span>matching resources</span><small>Sample preview catalogue</small></div></section>
  <section className="library-controls"><label className="library-search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search title, topic, keyword or tag…"/>{query&&<button onClick={()=>setQuery("")} aria-label="Clear search"><X size={14}/></button>}</label>
   <div className="filter-row"><label><span>Exam</span><select value={exam} onChange={e=>setExam(e.target.value)}><option>All exams</option><option>UPSC CSE</option><option>MPPSC</option></select></label><label><span>Subject</span><select value={subject} onChange={e=>setSubject(e.target.value)}><option>All subjects</option>{subjects.map(s=><option key={s}>{s}</option>)}</select></label><label><span>Resource type</span><select value={kind} onChange={e=>setKind(e.target.value)}><option>All formats</option>{Array.from(new Set(libraryItems.map(i=>i.type))).map(k=><option key={k}>{k}</option>)}</select></label><label><span>Language</span><select value={language} onChange={e=>setLanguage(e.target.value)}><option>All languages</option><option>Hindi</option><option>English</option></select></label><button className="clear-filters" onClick={()=>{setQuery("");setExam("All exams");setSubject("All subjects");setKind("All formats");setLanguage("All languages")}}>Reset filters</button></div>
  </section>
  <div className="library-results-head"><div><h3>Browse by subject</h3><p>Subjects contain topic clusters; each resource keeps its own metadata.</p></div><span>{Object.keys(grouped).length} SUBJECT GROUPS</span></div>
  {Object.entries(grouped).length===0?<section className="empty-library"><FileText size={26}/><strong>No resources match these filters</strong><p>Try another subject, format or search term.</p><button onClick={()=>{setQuery("");setExam("All exams");setSubject("All subjects");setKind("All formats");setLanguage("All languages")}}>Clear all filters</button></section>:<div className="subject-groups">{Object.entries(grouped).map(([subjectName,items])=><section className="subject-group" key={subjectName}><button className="subject-group-head" onClick={()=>setExpanded(expanded===subjectName?"":subjectName)} aria-expanded={expanded===subjectName}><span className="subject-symbol"><Layers3 size={17}/></span><span className="subject-group-name"><strong>{subjectName}</strong><small>{Array.from(new Set(items.map(i=>i.topic))).length} topics · {items.length} resources</small></span><span className="group-exams">{Array.from(new Set(items.map(i=>i.exam))).join(" · ")}</span><ChevronDown className={expanded===subjectName?"group-chevron open": "group-chevron"} size={17}/></button>{expanded===subjectName&&<div className="topic-list">{Object.entries(items.reduce<Record<string,LibraryItem[]>>((g,item)=>{(g[item.topic]??=[]).push(item);return g;},{})).map(([topic,topicItems])=><div className="topic-cluster" key={topic}><div className="topic-heading"><span/><strong>{topic}</strong><small>{topicItems.length} {topicItems.length===1?"resource":"resources"}</small></div><div className="resource-list">{topicItems.map(item=><article className="resource-card" key={item.id}><span className={"resource-type type-"+item.type.toLowerCase().replaceAll(" ","-")}>{item.type}</span><div className="resource-main"><h4>{item.title}</h4><p>{item.summary}</p><div className="resource-meta"><span>{item.exam}</span><i>·</i><span>{item.paper}</span><i>·</i><span>{item.language}</span><i>·</i><span>{item.updated}</span></div><div className="resource-tags">{item.tags.map(tag=><span key={tag}>{tag}</span>)}<span className="subtopic-tag">{item.subtopic}</span></div></div><button className="resource-open" title="Open resource" onClick={()=>window.alert("Resource viewer will open when the content backend is connected.")}><ArrowRight size={16}/></button></article>)}</div></div>)}</div>}</section>)}</div>}
  <p className="library-footnote"><Sparkles size={13}/> This is sample catalogue data. When the database is connected, these same filters and groups will use saved metadata rather than demo records.</p>
 </div>;
}
type TaxonomyNode = { name: string; topics: { name: string; subtopics: string[] }[] };
const taxonomy: Record<string, { papers: Record<string, TaxonomyNode[]> }> = {
 "UPSC CSE": { papers: {
  "GS Paper I": [{name:"इतिहास एवं संस्कृति",topics:[{name:"प्राचीन भारत",subtopics:["सिंधु घाटी सभ्यता","वैदिक काल","बौद्ध एवं जैन धर्म"]},{name:"आधुनिक भारत",subtopics:["1857 का विद्रोह","राष्ट्रीय आंदोलन","संवैधानिक विकास"]}]},{name:"भूगोल",topics:[{name:"भौतिक भूगोल",subtopics:["जलवायु","भू-आकृतियाँ","महासागर"]}]}],
  "GS Paper II": [{name:"भारतीय राजव्यवस्था",topics:[{name:"संवैधानिक विकास",subtopics:["कंपनी शासन","क्राउन शासन","संवैधानिक अधिनियम"]},{name:"मौलिक अधिकार",subtopics:["अनुच्छेद 12–13","समानता का अधिकार","स्वतंत्रता का अधिकार"]},{name:"DPSP एवं मौलिक कर्तव्य",subtopics:["नीति-निदेशक तत्व","मौलिक कर्तव्य","तुलनात्मक अध्ययन"]}]},{name:"Current Affairs",topics:[{name:"शासन एवं नीति",subtopics:["नीतिगत सुधार","संसद एवं शासन","समसामयिक विश्लेषण"]}]}],
  "GS Paper III": [{name:"भारतीय अर्थव्यवस्था",topics:[{name:"मौद्रिक नीति",subtopics:["RBI के उपकरण","मुद्रास्फीति","बैंकिंग प्रणाली"]}]},{name:"पर्यावरण एवं पारिस्थितिकी",topics:[{name:"जलवायु परिवर्तन",subtopics:["वैश्विक समझौते","Mitigation एवं adaptation","कार्बन बाजार"]}]}],
  "GS Paper IV": [{name:"नीतिशास्त्र",topics:[{name:"नैतिक अवधारणाएँ",subtopics:["मूल्य एवं दृष्टिकोण","नैतिक विचारक","केस स्टडी"]}]}],
  "Prelims": [{name:"Current Affairs",topics:[{name:"दैनिक समाचार",subtopics:["राष्ट्रीय समाचार","अंतरराष्ट्रीय समाचार","विज्ञान एवं तकनीक"]}]}]
 }},
 "MPPSC": { papers: {
  "State Specific": [{name:"मध्य प्रदेश विशेष",topics:[{name:"भौतिक भूगोल",subtopics:["नदी तंत्र","जलवायु","खनिज संसाधन"]},{name:"इतिहास एवं संस्कृति",subtopics:["प्राचीन स्थल","जनजातीय संस्कृति","आधुनिक मध्य प्रदेश"]}]}],
  "General Studies": [{name:"भारतीय राजव्यवस्था",topics:[{name:"संवैधानिक विकास",subtopics:["कंपनी शासन","क्राउन शासन","संवैधानिक अधिनियम"]}]},{name:"Current Affairs",topics:[{name:"मध्य प्रदेश करेंट अफेयर्स",subtopics:["राज्य योजनाएँ","राज्य बजट","समसामयिक घटनाएँ"]}]}]
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
  <section className="studio-saved"><div className="studio-panel-heading"><div><h3>Recently created in this session</h3><p>Local preview records — refresh clears these until Supabase is connected.</p></div><span className="draft-pill">{saved.length} ITEMS</span></div>{saved.length===0?<div className="studio-empty"><FileText size={22}/><strong>No resources created yet</strong><span>Fill the form and save a draft or publish a preview.</span></div>:<div className="studio-saved-list">{saved.map(item=><article className="studio-saved-item" key={item.id}><span className="saved-file"><FileText size={17}/></span><div className="saved-item-copy"><strong>{item.title}</strong><small>{item.exam} · {item.paper} · {item.subject} / {item.topic} / {item.subtopic}</small></div><span className={item.status==="Published"?"saved-status published":"saved-status"}>{item.status}</span></article>)}</div>}</section>
 </div>;
}
function Placeholder({title,subtitle,admin:staff}:{title:string;subtitle:string;admin:boolean}) {
 return <section className="placeholder"><div className="placeholder-icon">{staff?<Settings2 size={26}/>:<GraduationCap size={26}/>}</div><span className="eyebrow">{staff?"ADMINISTRATION WORKSPACE":"STUDENT WORKSPACE"}</span><h2>{title}</h2><p>{subtitle}</p><div className="divider"/><span className="ready"><CheckCircle2 size={15}/> Route is ready for implementation</span><p className="note">This page is currently a UI foundation. Live data, authentication, permissions and module-specific workflows must be connected before production use.</p></section>;
}
export default function App() {
 const [open,setOpen]=useState(false);const loc=useLocation();const page=pages[loc.pathname]??{title:"Page not found",subtitle:"This route is not available."};
 const renderNav=(items:NavItem[],label:string)=><div className="nav-group" key={label}><span className="nav-heading">{label}</span>{items.map(({to,label:item,icon:Icon})=><NavLink end={to==="/"} key={to} to={to} onClick={()=>setOpen(false)} className={({isActive})=>"nav-link"+(isActive?" active":"")}><Icon size={17}/><span>{item}</span></NavLink>)}</div>;
 return <div className="app-shell">{open&&<button className="backdrop" aria-label="Close navigation" onClick={()=>setOpen(false)}/>}<aside className={"sidebar"+(open?" sidebar-open":"")}><div className="brand"><div className="brand-mark"><GraduationCap size={22}/></div><div className="brand-name">New<span>IAS</span><small>CIVIL SERVICES LEARNING</small></div><button className="close-menu" aria-label="Close menu" onClick={()=>setOpen(false)}><X size={17}/></button></div><div className="workspace"><span>N</span><div><b>NewIAS Academy</b><small>Learning workspace</small></div><ChevronDown size={14}/></div><nav>{renderNav(student,"LEARNING")}{renderNav(admin,"ADMINISTRATION")}</nav><div className="sidebar-bottom"><div className="help"><b>Learning support</b><p>Keep classes, resources and practice in one place.</p><NavLink to="/library" onClick={()=>setOpen(false)}>Explore resources <ArrowRight size={12}/></NavLink></div><div className="account"><span>N</span><div><b>Preview session</b><small>Authentication not connected</small></div></div></div></aside>
 <main className="main"><header className="topbar"><div className="crumb"><button className="mobile-menu" aria-label="Open navigation" onClick={()=>setOpen(true)}><Menu size={19}/></button><span>Workspace</span><i>/</i><b>{page.title}</b></div><div className="top-actions"><button className="search" onClick={()=>window.alert("Search will be enabled when the content index is connected.")}><Search size={15}/><span>Search resources...</span><kbd>⌘ K</kbd></button><button className="bell" aria-label="Notifications"><Bell size={17}/></button><span className="avatar">N</span></div></header><div className="content"><div className="page-intro"><div><small>NEWIAS / {loc.pathname==="/"?"OVERVIEW":loc.pathname.slice(1).replaceAll("/"," / ").toUpperCase()}</small><h1>{page.title}</h1><p>{page.subtitle}</p></div><span className="study-chip"><CalendarDays size={14}/> Learning workspace</span></div><Routes><Route path="/" element={<Home/>}/>{Object.entries(pages).filter(([path])=>path!=="/"&&path!=="/library"&&path!=="/admin/content").map(([path,p])=><Route key={path} path={path} element={<Placeholder title={p.title} subtitle={p.subtitle} admin={path.startsWith("/admin")}/>}/>)}<Route path="/admin/content" element={<ContentStudio/>}/><Route path="/library" element={<LibraryPage/>}/><Route path="*" element={<Placeholder title="Page not found" subtitle="Choose a route from the navigation." admin={false}/>}/></Routes><footer><span>© 2026 NewIAS</span><span><i/> Independent project · preview data only</span></footer></div></main></div>;
}