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

export type CreateMemoryMutationVariables = Exact<{
  file: Scalars['Upload'];
  title: Scalars['String'];
  location?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
}>;


export type CreateMemoryMutation = (
  { __typename?: 'Mutation' }
  & { createMemory?: Maybe<(
    { __typename?: 'Memory' }
    & Pick<Memory, 'id' | 'title' | 'description' | 'thumbnail' | 'signedRequest' | 'url'>
  )> }
);

export type CreateStoryMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;


export type CreateStoryMutation = (
  { __typename?: 'Mutation' }
  & { createStory?: Maybe<(
    { __typename?: 'Story' }
    & Pick<Story, 'id' | 'url' | 'signedRequest'>
  )> }
);

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'login'>
);

export type RegisterMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
  name: Scalars['String'];
  secretCode: Scalars['String'];
  profilePicture: Scalars['Upload'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register?: Maybe<(
    { __typename?: 'Register' }
    & Pick<Register, 'accessToken' | 'signedRequest'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'name' | 'profilePicture'>
    ) }
  )> }
);

export type AllMemoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type AllMemoriesQuery = (
  { __typename?: 'Query' }
  & { memories?: Maybe<Array<Maybe<(
    { __typename?: 'Memory' }
    & Pick<Memory, 'id' | 'title' | 'description' | 'location' | 'thumbnail'>
  )>>> }
);

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = (
  { __typename?: 'Query' }
  & { users?: Maybe<Array<Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'name' | 'profilePicture'>
    & { stories?: Maybe<Array<Maybe<(
      { __typename?: 'Story' }
      & Pick<Story, 'id' | 'url'>
    )>>> }
  )>>> }
);

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


export const CreateMemoryDocument = gql`
    mutation createMemory($file: Upload!, $title: String!, $location: String, $description: String) {
  createMemory(file: $file, title: $title, location: $location, description: $description) {
    id
    title
    description
    thumbnail
    signedRequest
    url
  }
}
    `;
export type CreateMemoryMutationFn = Apollo.MutationFunction<CreateMemoryMutation, CreateMemoryMutationVariables>;

/**
 * __useCreateMemoryMutation__
 *
 * To run a mutation, you first call `useCreateMemoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMemoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMemoryMutation, { data, loading, error }] = useCreateMemoryMutation({
 *   variables: {
 *      file: // value for 'file'
 *      title: // value for 'title'
 *      location: // value for 'location'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useCreateMemoryMutation(baseOptions?: Apollo.MutationHookOptions<CreateMemoryMutation, CreateMemoryMutationVariables>) {
        return Apollo.useMutation<CreateMemoryMutation, CreateMemoryMutationVariables>(CreateMemoryDocument, baseOptions);
      }
export type CreateMemoryMutationHookResult = ReturnType<typeof useCreateMemoryMutation>;
export type CreateMemoryMutationResult = Apollo.MutationResult<CreateMemoryMutation>;
export type CreateMemoryMutationOptions = Apollo.BaseMutationOptions<CreateMemoryMutation, CreateMemoryMutationVariables>;
export const CreateStoryDocument = gql`
    mutation createStory($file: Upload!) {
  createStory(file: $file) {
    id
    url
    signedRequest
  }
}
    `;
export type CreateStoryMutationFn = Apollo.MutationFunction<CreateStoryMutation, CreateStoryMutationVariables>;

/**
 * __useCreateStoryMutation__
 *
 * To run a mutation, you first call `useCreateStoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateStoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createStoryMutation, { data, loading, error }] = useCreateStoryMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useCreateStoryMutation(baseOptions?: Apollo.MutationHookOptions<CreateStoryMutation, CreateStoryMutationVariables>) {
        return Apollo.useMutation<CreateStoryMutation, CreateStoryMutationVariables>(CreateStoryDocument, baseOptions);
      }
export type CreateStoryMutationHookResult = ReturnType<typeof useCreateStoryMutation>;
export type CreateStoryMutationResult = Apollo.MutationResult<CreateStoryMutation>;
export type CreateStoryMutationOptions = Apollo.BaseMutationOptions<CreateStoryMutation, CreateStoryMutationVariables>;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password)
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = gql`
    mutation register($email: String!, $password: String!, $name: String!, $secretCode: String!, $profilePicture: Upload!) {
  register(data: {email: $email, password: $password, name: $name, secretCode: $secretCode, profilePicture: $profilePicture}) {
    accessToken
    signedRequest
    user {
      id
      name
      profilePicture
    }
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *      name: // value for 'name'
 *      secretCode: // value for 'secretCode'
 *      profilePicture: // value for 'profilePicture'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, baseOptions);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const AllMemoriesDocument = gql`
    query allMemories {
  memories {
    id
    title
    description
    location
    thumbnail
  }
}
    `;

/**
 * __useAllMemoriesQuery__
 *
 * To run a query within a React component, call `useAllMemoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllMemoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllMemoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllMemoriesQuery(baseOptions?: Apollo.QueryHookOptions<AllMemoriesQuery, AllMemoriesQueryVariables>) {
        return Apollo.useQuery<AllMemoriesQuery, AllMemoriesQueryVariables>(AllMemoriesDocument, baseOptions);
      }
export function useAllMemoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllMemoriesQuery, AllMemoriesQueryVariables>) {
          return Apollo.useLazyQuery<AllMemoriesQuery, AllMemoriesQueryVariables>(AllMemoriesDocument, baseOptions);
        }
export type AllMemoriesQueryHookResult = ReturnType<typeof useAllMemoriesQuery>;
export type AllMemoriesLazyQueryHookResult = ReturnType<typeof useAllMemoriesLazyQuery>;
export type AllMemoriesQueryResult = Apollo.QueryResult<AllMemoriesQuery, AllMemoriesQueryVariables>;
export const GetUsersDocument = gql`
    query getUsers {
  users {
    id
    name
    profilePicture
    stories {
      id
      url
    }
  }
}
    `;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
        return Apollo.useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, baseOptions);
      }
export function useGetUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          return Apollo.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, baseOptions);
        }
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<typeof useGetUsersLazyQuery>;
export type GetUsersQueryResult = Apollo.QueryResult<GetUsersQuery, GetUsersQueryVariables>;
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