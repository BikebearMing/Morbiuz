import { getClient } from "@/lib/graphql-client";
import { GET_MENU_BY_LOCATION } from "@/lib/queries/menus";
import { MenuItem } from "@/types/wordpress";
import NavLink from "@/components/NavLink";
import TransitionLink from "@/components/TransitionLink";
import HeaderScroll from "@/components/HeaderScroll";
import HamburgerToggle from "@/components/HamburgerToggle";

type MenuNode = MenuItem & { children: MenuItem[] };

function buildTree(items: MenuItem[]): MenuNode[] {
  const map = new Map<string, MenuNode>();
  items.forEach((it) => map.set(it.id, { ...it, children: [] }));
  const roots: MenuNode[] = [];
  map.forEach((node) => {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

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

  const tree = buildTree(menuItems);

  return (
    <header className="header">
      <HeaderScroll />
      <nav className="nav">
        <TransitionLink href="/">
          <img className="logo"
            src="https://morbiuz.mydemobb.com/wp-content/uploads/2026/04/Vector.png"
            alt="Morbiuz"
          />
        </TransitionLink>
        <HamburgerToggle />
        <ul className="nav-links">
          {tree.length > 0
            ? tree.map((item) => (
                <NavLink
                  key={item.id}
                  href={item.uri}
                  submenu={item.children.map((c) => ({
                    id: c.id,
                    href: c.uri,
                    label: c.label,
                  }))}
                >
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
