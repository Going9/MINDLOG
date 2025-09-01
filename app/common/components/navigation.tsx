import { Link } from "react-router";
import { Separator } from "~/common/components/ui/separator";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { cn } from "~/lib/utils";

const menus = [
  {
    name: "일기",
    to: "/diary",
    items: [
      {
        name: "감정 일기 쓰기",
        description: "오늘의 감정과 경험을 기록해보세요",
        to: "/diary/new",
      },
      {
        name: "일기 목록",
        description: "작성한 일기들을 확인하고 관리하세요",
        to: "/diary",
      },
      {
        name: "일기 검색",
        description: "날짜, 감정, 태그별로 일기를 검색하세요",
        to: "/diary/search",
      },
    ],
  },
  {
    name: "분석",
    to: "/analytics",
    items: [
      {
        name: "감정 패턴",
        description: "감정 변화 패턴과 트렌드 분석",
        to: "/analytics/emotions",
      },
      {
        name: "통계",
        description: "일기 작성 빈도 및 통계",
        to: "/analytics/stats",
      },
    ],
  },
];

export default function Navigation() {
  return (
    <nav className='flex px-20 h-16 items-center justify-between backdrop-blur fixed top-0 left-0 right-0 z-50 bg-background/50'>
      <div className='flex items-center'>
        <Link to='/' className='font-bold tracking-tighter text-lg'>
          MINDLOG
        </Link>
        <Separator orientation='vertical' className='!h-6 mx-4' />
        <NavigationMenu>
          <NavigationMenuList>
            {menus.map(menu => (
              <NavigationMenuItem key={menu.name}>
                {menu.items ? (
                  <>
                    <Link to={menu.to}>
                      <NavigationMenuTrigger>{menu.name}</NavigationMenuTrigger>
                    </Link>
                    <NavigationMenuContent>
                      <ul className='grid w-[600px] font-light gap-3 p-4 grid-cols-2'>
                        {menu.items?.map(item => (
                          <li
                            key={item.name}
                            className={cn([
                              "select-none rounded-md transition-colors focus:bg-accent  hover:bg-accent",
                              item.to === "/diary/new" &&
                                "col-span-2 bg-primary/10 hover:bg-primary/20 focus:bg-primary/20",
                            ])}
                          >
                            <NavigationMenuLink asChild>
                              <Link
                                className='p-3 space-y-1 block leading-none no-underline outline-none'
                                to={item.to}
                              >
                                <span className='text-sm font-medium leading-none'>
                                  {item.name}
                                </span>
                                <p className='text-sm leading-snug text-muted-foreground'>
                                  {item.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <Link className={navigationMenuTriggerStyle()} to={menu.to}>
                    {menu.name}
                  </Link>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}
