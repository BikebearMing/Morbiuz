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

export interface FeaturedClient {
  client: string;
}

export interface ServiceItem {
  serviceGroup: {
    title: string;
    subtext: string;
    serviceImage: AcfImage | null;
  };
}

export interface Services {
  serviceRepeater: ServiceItem[] | null;
}

export interface HomeFields {
  hero: string | null;
  subtext: string | null;
  featuredClients: FeaturedClient[] | null;
  heroImages: HomeHeroImages | null;
  services: Services | null;
}

export interface HomePage {
  title: string;
  home: HomeFields;
}

export interface AcfLinkValue {
  url: string | null;
  title: string | null;
  target: string | null;
}

export interface GalleryImage {
  sourceUrl: string;
  altText: string;
}

export interface BtsName {
  name: string | null;
}

export interface BtsCredit {
  role: string | null;
  nameRepeater: BtsName[] | null;
}

export interface BtsCreditRow {
  btsCredit: BtsCredit | null;
}

export interface BtsGroup {
  btsCreditsRepeater: BtsCreditRow[] | null;
}

export interface VideoProductionPostGroup {
  projectName: string | null;
  projectYear: string | null;
  rightSideLabel: string | null;
  videoLink: AcfLinkValue | null;
  overviewText: string | null;
  imageGallery: { nodes: GalleryImage[] } | null;
  imageMasonry: { nodes: GalleryImage[] } | null;
  imageBannerHero: AcfImage | null;
  btsGroup: BtsGroup | null;
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
  videoProductionPostGroup?: VideoProductionPostGroup | null;
}

export interface MenuItem {
  id: string;
  label: string;
  uri: string;
  parentId: string | null;
  cssClasses: string[];
}

export interface Page {
  title: string;
  slug: string;
  content: string;
  featuredImage: FeaturedImage | null;
}

export interface SocialItem {
  socialGroup: {
    socialLink: {
      title: string;
      url: string;
      target: string | null;
    };
  };
}

export interface TeamMember {
  title: string;
  memberDetails: {
    position: string | null;
  } | null;
  featuredImage: FeaturedImage | null;
}

export interface FooterFields {
  topTitle: string | null;
  projectEnquiries: string | null;
  address: string | null;
  socials: {
    socialsRepeater: SocialItem[] | null;
  } | null;
}
