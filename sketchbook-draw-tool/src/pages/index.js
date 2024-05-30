import Menu from "@/components/Menu"
import Toolbox from "@/components/Toolbox"
import Board from "@/components/Board"
export default function Home() {
  return (
    <>
      <div>
        <h1 className="text-center mt-2 text-3xl">Online-DrawTool</h1>
      </div>

      <Menu />
      <Toolbox />
      <Board />
    </>
  );
}
