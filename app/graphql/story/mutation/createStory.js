import { gql } from "@apollo/client"

export const CREATE_STORY = gql`
         mutation createStory($name: String!, $type: String!, $uri: String!) {
           createStory(data: { name: $name, type: $type, uri: $uri}) {
             id
             createdAt
             file {
               name
               type
               uri
             }
           }
         }
       `
