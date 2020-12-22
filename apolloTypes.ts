

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createStory
// ====================================================

export interface createStory_createStory {
  id: string;
  url: string;
  signedRequest: string | null;
}

export interface createStory {
  createStory: createStory_createStory | null;
}

export interface createStoryVariables {
  file: any;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createMemory
// ====================================================

export interface createMemory_createMemory {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  signedRequest: string | null;
  url: string | null;
}

export interface createMemory {
  createMemory: createMemory_createMemory | null;
}

export interface createMemoryVariables {
  file: any;
  title: string;
  location?: string | null;
  description?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: register
// ====================================================

export interface register_register_user {
  id: string | null;
  name: string | null;
  profilePicture: string | null;
}

export interface register_register {
  accessToken: string;
  signedRequest: string | null;
  user: register_register_user;
}

export interface register {
  register: register_register | null;
}

export interface registerVariables {
  email: string;
  password: string;
  name: string;
  secretCode: string;
  profilePicture: any;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Login
// ====================================================

export interface Login {
  login: string | null;
}

export interface LoginVariables {
  email: string;
  password: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getUsers
// ====================================================

export interface getUsers_users_stories {
  id: string;
  url: string;
}

export interface getUsers_users {
  id: string | null;
  name: string | null;
  profilePicture: string | null;
  stories: (getUsers_users_stories | null)[] | null;
}

export interface getUsers {
  users: (getUsers_users | null)[] | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: allMemories
// ====================================================

export interface allMemories_memories {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  thumbnail: string | null;
}

export interface allMemories {
  memories: (allMemories_memories | null)[] | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================