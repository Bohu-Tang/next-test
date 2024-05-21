import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';
import {lusitana} from "@/app/ui/fonts";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo/>
          </div>
        </div>
        <LoginForm/>
      </div>
      <p className={`${lusitana.className} absolute bottom-0 right-0 text-xs text-gray-500`}>
        <a href={"https://beian.miit.gov.cn/"}
           target={"_blank"}>鲁ICP备19013167号</a>
      </p>

    </main>
  );
}