import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { ThemeModeToggler } from "../ThemeModeToggler";

export function NavBar() {
  return (
    <nav className="w-full py-5 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href={"/"}>
          <h1 className="text-3xl font-bold">
            Next <span className="text-blue-500">pro</span>
          </h1>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            className={buttonVariants({
              variant: "ghost",
            })}
            href={"/"}
          >
            Home
          </Link>
          <Link
            className={buttonVariants({
              variant: "ghost",
            })}
            href={"/blog"}
          >
            Blog
          </Link>
          <Link
            className={buttonVariants({
              variant: "ghost",
            })}
            href={"/create"}
          >
            Create blog
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ThemeModeToggler />
        <Link
          href={"/auth/login"}
          className={buttonVariants({
            variant: "secondary",
          })}
        >
          Login
        </Link>
        <Link href={"/auth/signup"} className={buttonVariants()}>
          Signup
        </Link>
      </div>
    </nav>
  );
}
