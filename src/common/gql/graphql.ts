/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
  DateTimeISO: { input: any; output: any; }
};

export type Book = {
  __typename?: 'Book';
  author: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isPublished: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
};

export type CreateBookInput = {
  author: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export enum Gender {
  Female = 'female',
  Male = 'male',
  Nottosay = 'nottosay'
}

export type Message = {
  __typename?: 'Message';
  id: Scalars['String']['output'];
  notes: Array<Note>;
  usersInvolved: Array<Users>;
};

export type Mutation = {
  __typename?: 'Mutation';
  AddNote?: Maybe<Note>;
  addFollowing: OperationInfo;
  createBook: Book;
  createUser: OperationInfo;
  deleteBook: OperationInfo;
  deleteUser: OperationInfo;
  updateBook: Book;
  updateUser: OperationInfo;
};


export type MutationAddNoteArgs = {
  data: AddMessageInput;
};


export type MutationAddFollowingArgs = {
  data: FollowInput;
};


export type MutationCreateBookArgs = {
  data: CreateBookInput;
};


export type MutationCreateUserArgs = {
  data: CreateUserInput;
};


export type MutationDeleteBookArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateBookArgs = {
  data: UpdateBookInput;
  id: Scalars['String']['input'];
};


export type MutationUpdateUserArgs = {
  data: UpdateUserInput;
};

export type NewNoteNotification = {
  __typename?: 'NewNoteNotification';
  newNote: Note;
  target_id: Scalars['String']['output'];
};

export type Note = {
  __typename?: 'Note';
  content: Scalars['String']['output'];
  createdDate: Scalars['DateTimeISO']['output'];
  id: Scalars['String']['output'];
  message: Message;
  sender: Users;
};

export type OperationInfo = {
  __typename?: 'OperationInfo';
  id?: Maybe<Scalars['String']['output']>;
  msg?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  token?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  LastNote?: Maybe<Note>;
  Message?: Maybe<Message>;
  book: Book;
  books: Array<Book>;
  login: OperationInfo;
  refresh: OperationInfo;
  user: Users;
  users: Array<Users>;
  verify: OperationInfo;
};


export type QueryLastNoteArgs = {
  data: GetMessageInput;
};


export type QueryMessageArgs = {
  data: GetMessageInput;
};


export type QueryBookArgs = {
  id: Scalars['String']['input'];
};


export type QueryLoginArgs = {
  data: LoginInput;
};


export type QueryRefreshArgs = {
  oldToken: Scalars['String']['input'];
};


export type QueryUserArgs = {
  finderId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};


export type QueryUsersArgs = {
  finderId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryVerifyArgs = {
  token: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  newNote: NewNoteNotification;
};


export type SubscriptionNewNoteArgs = {
  recipientID: Scalars['String']['input'];
};

export type UpdateBookInput = {
  author?: InputMaybe<Scalars['String']['input']>;
  isPublished?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Gender>;
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type Users = {
  __typename?: 'Users';
  avatar: Scalars['String']['output'];
  bio?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  followers: Array<Users>;
  following: Array<Users>;
  gender?: Maybe<Gender>;
  id: Scalars['String']['output'];
  isOnline: Scalars['Boolean']['output'];
  lastNote?: Maybe<Note>;
  messages: Array<Message>;
  name: Scalars['String']['output'];
  password: Scalars['String']['output'];
  website?: Maybe<Scalars['String']['output']>;
};

export type AddMessageInput = {
  content: Scalars['String']['input'];
  id1: Scalars['String']['input'];
  id2: Scalars['String']['input'];
  sender: Scalars['String']['input'];
};

export type FollowInput = {
  followedId: Scalars['String']['input'];
  followerId: Scalars['String']['input'];
};

export type GetMessageInput = {
  id1: Scalars['String']['input'];
  id2: Scalars['String']['input'];
};

export type LoginInput = {
  id: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type MessageQueryQueryVariables = Exact<{
  data: GetMessageInput;
}>;


export type MessageQueryQuery = { __typename?: 'Query', Message?: { __typename?: 'Message', notes: Array<{ __typename?: 'Note', id: string, content: string, createdDate: any, sender: { __typename?: 'Users', id: string } }>, usersInvolved: Array<{ __typename?: 'Users', email: string }> } | null };

export type SubToNewNoteSubscriptionVariables = Exact<{
  recipientId: Scalars['String']['input'];
}>;


export type SubToNewNoteSubscription = { __typename?: 'Subscription', newNote: { __typename?: 'NewNoteNotification', target_id: string, newNote: { __typename?: 'Note', id: string, content: string, createdDate: any, sender: { __typename?: 'Users', id: string } } } };

export type DelMutationMutationVariables = Exact<{
  deleteUserId: Scalars['String']['input'];
}>;


export type DelMutationMutation = { __typename?: 'Mutation', deleteUser: { __typename?: 'OperationInfo', msg?: string | null, success: boolean } };

export type FollowMutationMutationVariables = Exact<{
  data: FollowInput;
}>;


export type FollowMutationMutation = { __typename?: 'Mutation', addFollowing: { __typename?: 'OperationInfo', success: boolean, msg?: string | null } };

export type UserQueryQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type UserQueryQuery = { __typename?: 'Query', user: { __typename?: 'Users', id: string, name: string, email: string, avatar: string, isOnline: boolean, bio?: string | null, website?: string | null, gender?: Gender | null, followers: Array<{ __typename?: 'Users', id: string }>, following: Array<{ __typename?: 'Users', id: string }> } };

export type UpdUserMutationVariables = Exact<{
  data: UpdateUserInput;
}>;


export type UpdUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'OperationInfo', success: boolean, msg?: string | null } };

export type UpdateFieldFragment = { __typename?: 'Users', id: string, website?: string | null, bio?: string | null, gender?: Gender | null, name: string, avatar: string } & { ' $fragmentName'?: 'UpdateFieldFragment' };

export type AvatarQueryQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type AvatarQueryQuery = { __typename?: 'Query', user: { __typename?: 'Users', avatar: string } };

export type LoginQueryQueryVariables = Exact<{
  data: LoginInput;
}>;


export type LoginQueryQuery = { __typename?: 'Query', login: { __typename?: 'OperationInfo', msg?: string | null, success: boolean, token?: string | null } };

export type RefreshQueryQueryVariables = Exact<{
  oldToken: Scalars['String']['input'];
}>;


export type RefreshQueryQuery = { __typename?: 'Query', refresh: { __typename?: 'OperationInfo', msg?: string | null, success: boolean, token?: string | null } };

export type AddUserMuttationMutationVariables = Exact<{
  data: CreateUserInput;
}>;


export type AddUserMuttationMutation = { __typename?: 'Mutation', createUser: { __typename?: 'OperationInfo', success: boolean, msg?: string | null } };

export type UsersQueryQueryVariables = Exact<{
  finderId?: InputMaybe<Scalars['String']['input']>;
}>;


export type UsersQueryQuery = { __typename?: 'Query', users: Array<{ __typename?: 'Users', id: string, isOnline: boolean, name: string, avatar: string, lastNote?: { __typename?: 'Note', content: string, createdDate: any } | null }> };

export type VerifyQueryQueryVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type VerifyQueryQuery = { __typename?: 'Query', verify: { __typename?: 'OperationInfo', success: boolean, msg?: string | null, id?: string | null } };

export type AddNoteMutationVariables = Exact<{
  data: AddMessageInput;
}>;


export type AddNoteMutation = { __typename?: 'Mutation', AddNote?: { __typename?: 'Note', content: string, createdDate: any, id: string } | null };

export const UpdateFieldFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"updateField"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Users"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]} as unknown as DocumentNode<UpdateFieldFragment, unknown>;
export const MessageQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MessageQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"getMessageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Message"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdDate"}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"usersInvolved"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<MessageQueryQuery, MessageQueryQueryVariables>;
export const SubToNewNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"subToNewNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recipientId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"recipientID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recipientId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"target_id"}},{"kind":"Field","name":{"kind":"Name","value":"newNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdDate"}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SubToNewNoteSubscription, SubToNewNoteSubscriptionVariables>;
export const DelMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"delMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deleteUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deleteUserId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"msg"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DelMutationMutation, DelMutationMutationVariables>;
export const FollowMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"followMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"followInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addFollowing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"msg"}}]}}]}}]} as unknown as DocumentNode<FollowMutationMutation, FollowMutationMutationVariables>;
export const UserQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"userQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"isOnline"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"followers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"following"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<UserQueryQuery, UserQueryQueryVariables>;
export const UpdUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"msg"}}]}}]}}]} as unknown as DocumentNode<UpdUserMutation, UpdUserMutationVariables>;
export const AvatarQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"avatarQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]} as unknown as DocumentNode<AvatarQueryQuery, AvatarQueryQueryVariables>;
export const LoginQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"loginQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"loginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"msg"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<LoginQueryQuery, LoginQueryQueryVariables>;
export const RefreshQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"refreshQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oldToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refresh"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"oldToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oldToken"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"msg"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<RefreshQueryQuery, RefreshQueryQueryVariables>;
export const AddUserMuttationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addUserMuttation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"msg"}}]}}]}}]} as unknown as DocumentNode<AddUserMuttationMutation, AddUserMuttationMutationVariables>;
export const UsersQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"usersQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"finderId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"finderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"finderId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isOnline"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"lastNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdDate"}}]}}]}}]}}]} as unknown as DocumentNode<UsersQueryQuery, UsersQueryQueryVariables>;
export const VerifyQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"verifyQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verify"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"msg"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<VerifyQueryQuery, VerifyQueryQueryVariables>;
export const AddNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"addMessageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"AddNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdDate"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AddNoteMutation, AddNoteMutationVariables>;