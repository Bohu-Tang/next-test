import SideNav from "@/app/ui/dashboard/sidenav";
import {lusitana} from "@/app/ui/fonts";

export default function Layout({children}: { children: React.ReactNode }) {
  return (
    <>

      <div className="flex h-screen flex-col md:flex-row md: overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav></SideNav>
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>

      </div>
      {/*将备案信息放到底部*/}
      <p className={`${lusitana.className} text-center text-xs text-gray-500`}>
        <a href={"https://beian.miit.gov.cn/"}
           target={"_blank"}>鲁ICP备19013167号</a>
      </p>
    </>
  )
}