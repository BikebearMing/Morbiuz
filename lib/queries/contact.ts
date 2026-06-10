import { gql } from "graphql-request";

export const GET_CONTACT_FORM = gql`
  query GetContactForm($id: ID!) {
    gfForm(id: $id, idType: DATABASE_ID) {
      databaseId
      title
      submitButton {
        text
      }
      formFields {
        nodes {
          type
          databaseId
          ... on GfFieldWithLabelSetting {
            label
          }
          ... on NameField {
            isRequired
            inputs {
              id
              label
              placeholder
              isHidden
            }
          }
          ... on TextField {
            isRequired
            placeholder
          }
          ... on EmailField {
            isRequired
            placeholder
          }
          ... on TextAreaField {
            isRequired
            placeholder
          }
          ... on PhoneField {
            isRequired
            placeholder
          }
          ... on SelectField {
            isRequired
            choices {
              text
              value
            }
          }
        }
      }
    }
  }
`;

export const SUBMIT_CONTACT_FORM = gql`
  mutation SubmitContactForm($input: SubmitGfFormInput!) {
    submitGfForm(input: $input) {
      errors {
        id
        message
      }
      entry {
        ... on GfSubmittedEntry {
          databaseId
        }
      }
      confirmation {
        message
        type
        url
      }
    }
  }
`;

export const GET_CONTACT_PAGE = gql`
  query GetContactPage {
    page(id: "contact", idType: URI) {
      contactContent {
        bannerImage {
          node {
            sourceUrl
            altText
          }
        }
        bannerSubhead
        bannerTitle
        messageSubhead
        messageTitle
        contactIntro
        email
        address
        faqSubhead
        faqTitle
        faqImage1 {
          node {
            sourceUrl
            altText
          }
        }
        faqImage2 {
          node {
            sourceUrl
            altText
          }
        }
        faqs {
          question
          answer
        }
      }
    }
  }
`;
