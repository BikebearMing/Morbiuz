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
    // Only queried where an accurate aspect ratio is needed (e.g. images sized
    // with width:auto / height:auto rather than object-fit in a fixed box).
    mediaDetails?: { width: number; height: number } | null;
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

export interface VideoZoom {
  title1: string | null;
  title2: string | null;
  video: string | null;
  caption: string | null;
}

export interface OurTeamTeaser {
  bgImage: AcfImage | null;
  peopleImage: AcfImage | null;
  title: string | null;
  buttonLabel: string | null;
  buttonUrl: string | null;
}

export interface FeaturedProject {
  projectName: string | null;
  client: string | null;
  year: string | null;
  video1: string | null;
  video2: string | null;
}

// Separate ACF group (graphql_field_name: "homeContent") so it can be imported
// without colliding with the existing `home` group.
export interface HomeContentFields {
  mobiusBgImage: AcfImage | null;
  videoZoom: VideoZoom | null;
  servicesIntro: string | null;
  servicesImage: AcfImage | null;
  ourTeam: OurTeamTeaser | null;
  featuredProject: FeaturedProject | null;
}

export interface HomePage {
  title: string;
  home: HomeFields;
  homeContent: HomeContentFields | null;
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

export interface FaqItemFields {
  question: string | null;
  answer: string | null;
}

// ACF group (graphql_field_name: "contactContent") on the Contact page.
export interface ContactContentFields {
  bannerImage: AcfImage | null;
  bannerSubhead: string | null;
  bannerTitle: string | null;
  messageSubhead: string | null;
  messageTitle: string | null;
  contactIntro: string | null;
  email: string | null;
  address: string | null;
  faqSubhead: string | null;
  faqTitle: string | null;
  faqImage1: AcfImage | null;
  faqImage2: AcfImage | null;
  faqs: FaqItemFields[] | null;
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

export interface SlidingCard {
  image: AcfImage | null;
}

export interface CultureParagraph {
  text: string | null;
}

// ACF group (graphql_field_name: "aboutContent") on the About page.
export interface AboutContentFields {
  bannerImage: AcfImage | null;
  bannerSubhead: string | null;
  bannerTitle: string | null;
  introSubhead: string | null;
  introHeading: string | null;
  introBody: string | null;
  slidingCards: SlidingCard[] | null;
  teamSubhead: string | null;
  teamTitle: string | null;
  cultureImage: AcfImage | null;
  cultureSubhead: string | null;
  cultureHeading: string | null;
  cultureParagraphs: CultureParagraph[] | null;
}

export interface FooterFields {
  topTitle: string | null;
  projectEnquiries: string | null;
  address: string | null;
  socials: {
    socialsRepeater: SocialItem[] | null;
  } | null;
}
