import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Upload: any;
};

export type Query = {
  __typename?: 'Query';
  memory?: Maybe<Memory>;
  memories?: Maybe<Array<Maybe<Memory>>>;
  allMemories?: Maybe<Array<Maybe<Memory>>>;
  story?: Maybe<Story>;
  stories?: Maybe<Array<Maybe<Story>>>;
  users?: Maybe<Array<Maybe<User>>>;
  me?: Maybe<User>;
};

export type Memory = {
  __typename?: 'Memory';
  id: Scalars['ID'];
  title: Scalars['String'];
  thumbnail?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  signedRequest?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type Story = {
  __typename?: 'Story';
  id: Scalars['ID'];
  url: Scalars['String'];
  signedRequest?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  profilePicture?: Maybe<Scalars['String']>;
  stories?: Maybe<Array<Maybe<Story>>>;
  memories?: Maybe<Array<Maybe<Memory>>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  login?: Maybe<Scalars['String']>;
  createMemory?: Maybe<Memory>;
  updateMemory?: Maybe<Memory>;
  deleteMemory?: Maybe<Memory>;
  register?: Maybe<Register>;
  createStory?: Maybe<Story>;
  updateStory?: Maybe<Story>;
  deleteStory?: Maybe<Scalars['String']>;
  uploadFile?: Maybe<File>;
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationCreateMemoryArgs = {
  file: Scalars['Upload'];
  title: Scalars['String'];
  location?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Scalars['String']>;
};


export type MutationUpdateMemoryArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteMemoryArgs = {
  id: Scalars['ID'];
};


export type MutationRegisterArgs = {
  data?: Maybe<RegisterInput>;
};


export type MutationCreateStoryArgs = {
  file: Scalars['Upload'];
};


export type MutationUpdateStoryArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteStoryArgs = {
  createdAt?: Maybe<Scalars['String']>;
};


export type MutationUploadFileArgs = {
  file: Scalars['Upload'];
  title?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
};


export type RegisterInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  name: Scalars['String'];
  secretCode: Scalars['String'];
  profilePicture: Scalars['Upload'];
};

export type Register = {
  __typename?: 'Register';
  accessToken: Scalars['String'];
  signedRequest?: Maybe<Scalars['String']>;
  user: User;
};

export type File = {
  __typename?: 'File';
  filename: Scalars['String'];
  mimetype: Scalars['String'];
  encoding: Scalars['String'];
  signedRequest?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type Unnamed_1_QueryVariables = Exact<{ [key: string]: never; }>;


export type Unnamed_1_Query = (
  { __typename?: 'Query' }
  & { users?: Maybe<Array<Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'name'>
    & { stories?: Maybe<Array<Maybe<(
      { __typename?: 'Story' }
      & Pick<Story, 'url'>
    )>>> }
  )>>> }
);


export const Document = gql`
    {
  users {
    name
    stories {
      url
    }
  }
}
    `;

/**
 * __useQuery__
 *
 * To run a query within a React component, call `useQuery` and pass it any options that fit your needs.
 * When your component renders, `useQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQuery({
 *   variables: {
 *   },
 * });
 */
export function useQuery(baseOptions?: Apollo.QueryHookOptions<Query, QueryVariables>) {
        return Apollo.useQuery<Query, QueryVariables>(Document, baseOptions);
      }
export function useLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Query, QueryVariables>) {
          return Apollo.useLazyQuery<Query, QueryVariables>(Document, baseOptions);
        }
export type QueryHookResult = ReturnType<typeof useQuery>;
export type LazyQueryHookResult = ReturnType<typeof useLazyQuery>;
export type QueryResult = Apollo.QueryResult<Query, QueryVariables>;