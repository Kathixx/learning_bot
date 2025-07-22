"use client";

import { Worker } from "@react-pdf-viewer/core"
import { Viewer } from "@react-pdf-viewer/core"
import { toolbarPlugin } from "@react-pdf-viewer/toolbar"
import type { ToolbarSlot, TransformToolbarSlot } from "@react-pdf-viewer/toolbar"

import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"
import "@react-pdf-viewer/toolbar/lib/styles/index.css"


export function PDFViewer() {
  const toolbarPluginInstance = toolbarPlugin();

  const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;


  const transform: TransformToolbarSlot = (slot: ToolbarSlot) => ({
    ...slot,
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
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <div className="relative">
        <div className="absolute left-1/2 -translate-x-1/2 z-10 rounded-full bg-background dark:bg-foreground my-shadow">
          <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
        </div>
      </div>
      <Viewer plugins={[toolbarPluginInstance]} fileUrl="/nachhaltigkeit.pdf"/>
    </Worker>
  );
}
