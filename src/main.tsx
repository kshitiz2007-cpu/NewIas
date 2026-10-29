import { Component, StrictMode, type ErrorInfo, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";
import "./ui-effects.css";
const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false } } });
class AppErrorBoundary extends Component<{children:ReactNode},{error:Error|null}> {
 state={error:null as Error|null};
 static getDerivedStateFromError(error:Error){return {error};}
 componentDidCatch(error:Error,info:ErrorInfo){console.error("NewIAS render error:",error,info.componentStack);}
 render(){
  if(this.state.error)return <main style={{minHeight:"100vh",display:"grid",placeItems:"center",padding:24,background:"#fbf7f4",color:"#382d31",fontFamily:"system-ui,sans-serif"}}><section style={{width:"min(100%,560px)",padding:24,border:"1px solid #eadce2",borderRadius:20,background:"#fffdfb",boxShadow:"0 16px 50px #382d3118"}}><h1 style={{marginTop:0}}>NewIAS could not open this screen</h1><p>The app encountered a rendering error instead of loading the page. Refresh once; if it continues, share the error below with the developer.</p><pre style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere",padding:12,borderRadius:10,background:"#f8edf1",fontSize:12}}>{this.state.error.message}</pre><button onClick={()=>window.location.reload()} style={{padding:"11px 16px",border:0,borderRadius:10,background:"#a95172",color:"white",fontWeight:700}}>Reload app</button></section></main>;
  return this.props.children;
 }
}

createRoot(document.getElementById("root")!).render(<StrictMode><QueryClientProvider client={queryClient}><BrowserRouter><AppErrorBoundary><App /></AppErrorBoundary></BrowserRouter></QueryClientProvider></StrictMode>);