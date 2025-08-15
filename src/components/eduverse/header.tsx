
'use client';

import {
  Bell,
  Home,
  Menu,
  X,
  Send,
  BookCopy,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Link from 'next/link';

export function Header() {
  const menuItems = [
    {
      href: '/',
      label: 'Homepage',
      icon: <Home className="h-5 w-5" />,
    },
    {
      href: '/verifieduser',
      label: 'Batches',
      icon: <BookCopy className="h-5 w-5" />,
    },
    {
      href: 'https://t.me/EduVerse_Network',
      label: 'Telegram',
      icon: <Send className="h-5 w-5" />,
      target: '_blank',
    },
    {
      href: 'https://t.me/Akki_IzPro',
      label: 'Contact Akki',
      icon: <MessageSquare className="h-5 w-5" />,
      target: '_blank',
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
                 <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-white bg-black/30 hover:bg-black/50 backdrop-blur-sm"
                        aria-label="Toggle Menu"
                      >
                        <Menu className="h-6 w-6" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[350px] bg-slate-900 text-white border-slate-800 p-0">
                      <SheetHeader className="p-6 border-b border-slate-800 text-left">
                        <SheetTitle className="text-white text-2xl">Menu</SheetTitle>
                         <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary text-white">
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close</span>
                        </SheetClose>
                      </SheetHeader>
                      <div className="p-4">
                        <nav className="flex flex-col gap-2">
                          {menuItems.map((item) => (
                            <Link
                              href={item.href}
                              key={item.label}
                              target={item.target}
                              rel={item.target === '_blank' ? 'noopener noreferrer' : ''}
                            >
                                <SheetClose asChild>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-lg py-6 gap-4 hover:bg-slate-800 hover:text-white"
                                    >
                                        {item.icon}
                                        {item.label}
                                    </Button>
                                </SheetClose>
                            </Link>
                          ))}
                        </nav>
                      </div>
                    </SheetContent>
                  </Sheet>
                 <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-white bg-black/30 hover:bg-black/50 backdrop-blur-sm"
                        aria-label="Toggle Notifications"
                      >
                        <Bell className="h-6 w-6" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 bg-white mr-4">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">Notifications</h4>
                          <p className="text-sm text-muted-foreground">
                            You have 1 unread message.
                          </p>
                        </div>
                        <div className="grid gap-2">
                          <div className="flex items-start gap-4 p-2 rounded-lg hover:bg-accent">
                            <ShieldCheck className="h-6 w-6 mt-1 text-green-500" />
                            <div className="grid gap-1">
                              <p className="text-sm font-medium">Welcome to EduVerse!</p>
                              <p className="text-sm text-muted-foreground">
                                You have successfully gained access to all courses. Happy learning!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
            </div>
        </div>
    </header>
  );
}
