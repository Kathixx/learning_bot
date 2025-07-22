// import {PDFViewer} from "@/components/pdf-viewer"
import {TestContainer} from "@/components/test-container"

export default async function TestBot() {

  return (
    <div className="w-full h-screen grid grid-cols-2">
      <div className="w-full justify-center items-center h-screen pt-[100px]">      
        {/* <PDFViewer></PDFViewer> */}
        <div></div>
      </div>
      <TestContainer></TestContainer>
    </div>
  );
}