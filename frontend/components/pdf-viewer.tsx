"use client";
import { useLearnContext } from "@/app/[locale]/protected/learning/page"
import { Worker, Viewer } from "@react-pdf-viewer/core"
import { dropPlugin } from "@react-pdf-viewer/drop"
import { toolbarPlugin } from "@react-pdf-viewer/toolbar"
import type { ToolbarSlot, TransformToolbarSlot } from "@react-pdf-viewer/toolbar"

import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"
import "@react-pdf-viewer/toolbar/lib/styles/index.css"
import '@react-pdf-viewer/drop/lib/styles/index.css';


export function PDFViewer() {

  const ctx = useLearnContext();
  if (!ctx) throw new Error("Must be used inside <MessageProvider>");
  const { filename } = ctx;
  
  const toolbarPluginInstance = toolbarPlugin();
  const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;

  const filepath = "http://localhost:5002/pdfs/"+filename

  const dropPluginInstance = dropPlugin();

  const transform: TransformToolbarSlot = (slot: ToolbarSlot) => ({
    ...slot,
    Open: ()=><></>,
    Search: () => <></>,
    Download: () => <></>,
    DownloadMenuItem: () => <></>,
    EnterFullScreen: () => <></>,
    EnterFullScreenMenuItem: () => <></>,
    SwitchTheme: () => <></>,
    SwitchThemeMenuItem: () => <></>,
    Print: () => <></>,
    ZoomIn: () => <></>,
    ZoomOut: () => <></>,
    Zoom: () => <></>,
    MoreActionsPopover: () => <></>,
});

  return (
    <div className="px-4 py-4 w-full h-full bg-background rounded-lg">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 z-10 rounded-full bg-light border-primary">
            <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
          </div>
        </div>
        <Viewer plugins={[toolbarPluginInstance, dropPluginInstance]} fileUrl={filepath} />
      </Worker>
    </div>
  );
}
