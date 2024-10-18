import { Separator } from "@/components/ui/separator"

const Footer = () => {
  return (
    <footer className="bg-background py-6 px-4">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row md:py-0">
        <Separator className="md:hidden" />
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          &copy; 2023 404资源桶. 保留所有权利.
        </p>
        <Separator className="md:hidden" />
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          <a 
            href="https://github.com/404资源桶" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            项目地址
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer;
