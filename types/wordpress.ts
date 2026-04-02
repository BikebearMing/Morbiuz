export interface FeaturedImage {
  node: {
    sourceUrl: string;
    altText: string;
  };
}

export interface Category {
  name: string;
  slug: string;
  count?: number;
}

export interface AcfImage {
  node: {
    sourceUrl: string;
    altText: string;
  } | null;
}

export interface HomeHeroImages {
  heroImage1: AcfImage | null;
  heroImage2: AcfImage | null;
  heroImage3: AcfImage | null;
  heroImage4: AcfImage | null;
  heroImage5: AcfImage | null;
}

export interface HomeFields {
  hero: string | null;
  subtext: string | null;
  heroImages: HomeHeroImages | null;
}

export interface HomePage {
  title: string;
  home: HomeFields;
}

export interface Post {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content: string;
  featuredImage: FeaturedImage | null;
  categories: {
    nodes: Category[];
  };
}

export interface Page {
  title: string;
  slug: string;
  content: string;
  featuredImage: FeaturedImage | null;
}
