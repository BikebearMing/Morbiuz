import { getClient } from "@/lib/graphql-client";
import { GET_MENU_BY_LOCATION } from "@/lib/queries/menus";
import { MenuItem } from "@/types/wordpress";
import NavLink from "@/components/NavLink";
import HeaderScroll from "@/components/HeaderScroll";

export async function Navigation() {
  const client = getClient();

  let menuItems: MenuItem[] = [];
  try {
    const data = await client.request<{
      menuItems: { nodes: MenuItem[] };
    }>(GET_MENU_BY_LOCATION, { location: "PRIMARY" });
    menuItems = data.menuItems.nodes;
  } catch (error) {
    console.error("Navigation menu fetch failed:", error);
  }

  return (
    <header className="header">
      <HeaderScroll />
      <nav className="nav">
        <NavLink href="/">
          <img className="logo"
            src="https://morbiuz.mydemobb.com/wp-content/uploads/2026/04/Vector.png"
            alt="Morbiuz"
          />
        </NavLink>
        <ul className="nav-links">
          {menuItems.length > 0
            ? menuItems
                .filter((item) => !item.parentId)
                .map((item) => (
                  <NavLink key={item.id} href={item.uri}>
                    {item.label}
                  </NavLink>
                ))
            : (
              <>
                <NavLink href="/">Home</NavLink>
                <NavLink href="/blog">Blog</NavLink>
              </>
            )}
        </ul>
      </nav>
    </header>
  );
}
