/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { Context } from "./../context"
import type { FieldAuthorizeResolver } from "nexus/dist/plugins/fieldAuthorizePlugin"
import type { core, connectionPluginCore } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "DateTime";
    /**
     * A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/.
     */
    email<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "EmailAddress";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
    /**
     * A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/.
     */
    email<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "EmailAddress";
    /**
     * Adds a Relay-style connection to the type, with numerous options for configuration
     *
     * @see https://nexusjs.org/docs/plugins/connection
     */
    connectionField<FieldName extends string>(
      fieldName: FieldName,
      config: connectionPluginCore.ConnectionFieldConfig<TypeName, FieldName>
    ): void
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  GetMyPostsFilterInput: { // input type
    published: boolean | null; // Boolean
    searchQuery?: string | null; // String
    unpublished: boolean | null; // Boolean
  }
  GetPublishedPostsFilterInput: { // input type
    authorIds?: string[] | null; // [ID!]
    searchQuery?: string | null; // String
  }
  UserPostsFilterInput: { // input type
    searchQuery?: string | null; // String
  }
}

export interface NexusGenEnums {
  Role: "ADMIN" | "USER"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  DateTime: any
  EmailAddress: any
}

export interface NexusGenObjects {
  Mutation: {};
  PageInfo: { // root type
    endCursor?: string | null; // String
    hasNextPage: boolean; // Boolean!
    hasPreviousPage: boolean; // Boolean!
    startCursor?: string | null; // String
  }
  Post: { // root type
    authorId: string; // ID!
    content: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // ID!
    published: boolean; // Boolean!
    publishedAt?: NexusGenScalars['DateTime'] | null; // DateTime
    title: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  PostEdge: { // root type
    cursor: string; // String!
    node: NexusGenRootTypes['Post']; // Post!
  }
  Query: {};
  QueryGetMyPosts_Connection: { // root type
    edges: NexusGenRootTypes['PostEdge'][]; // [PostEdge!]!
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
  }
  QueryGetPublishedPosts_Connection: { // root type
    edges: NexusGenRootTypes['PostEdge'][]; // [PostEdge!]!
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
  }
  User: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    email?: NexusGenScalars['EmailAddress'] | null; // EmailAddress
    id: string; // ID!
    name: string; // String!
    role: NexusGenEnums['Role']; // Role!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  UserPosts_Connection: { // root type
    edges: NexusGenRootTypes['PostEdge'][]; // [PostEdge!]!
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  Mutation: { // field return type
    changeUserRole: NexusGenRootTypes['User']; // User!
    createPost: NexusGenRootTypes['Post']; // Post!
    deletePost: boolean; // Boolean!
    login: boolean; // Boolean!
    logout: boolean; // Boolean!
    registerUser: NexusGenRootTypes['User']; // User!
    updatePost: NexusGenRootTypes['Post']; // Post!
  }
  PageInfo: { // field return type
    endCursor: string | null; // String
    hasNextPage: boolean; // Boolean!
    hasPreviousPage: boolean; // Boolean!
    startCursor: string | null; // String
  }
  Post: { // field return type
    author: NexusGenRootTypes['User']; // User!
    authorId: string; // ID!
    content: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // ID!
    published: boolean; // Boolean!
    publishedAt: NexusGenScalars['DateTime'] | null; // DateTime
    title: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  PostEdge: { // field return type
    cursor: string; // String!
    node: NexusGenRootTypes['Post']; // Post!
  }
  Query: { // field return type
    getMyPosts: NexusGenRootTypes['QueryGetMyPosts_Connection']; // QueryGetMyPosts_Connection!
    getPost: NexusGenRootTypes['Post'] | null; // Post
    getPublishedPosts: NexusGenRootTypes['QueryGetPublishedPosts_Connection']; // QueryGetPublishedPosts_Connection!
    getUser: NexusGenRootTypes['User'] | null; // User
    getUserMe: NexusGenRootTypes['User'] | null; // User
  }
  QueryGetMyPosts_Connection: { // field return type
    edges: NexusGenRootTypes['PostEdge'][]; // [PostEdge!]!
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
    totalCount: number; // Int!
  }
  QueryGetPublishedPosts_Connection: { // field return type
    edges: NexusGenRootTypes['PostEdge'][]; // [PostEdge!]!
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
    totalCount: number; // Int!
  }
  User: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    email: NexusGenScalars['EmailAddress'] | null; // EmailAddress
    id: string; // ID!
    name: string; // String!
    posts: NexusGenRootTypes['UserPosts_Connection']; // UserPosts_Connection!
    role: NexusGenEnums['Role']; // Role!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  UserPosts_Connection: { // field return type
    edges: NexusGenRootTypes['PostEdge'][]; // [PostEdge!]!
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
    totalCount: number; // Int!
  }
}

export interface NexusGenFieldTypeNames {
  Mutation: { // field return type name
    changeUserRole: 'User'
    createPost: 'Post'
    deletePost: 'Boolean'
    login: 'Boolean'
    logout: 'Boolean'
    registerUser: 'User'
    updatePost: 'Post'
  }
  PageInfo: { // field return type name
    endCursor: 'String'
    hasNextPage: 'Boolean'
    hasPreviousPage: 'Boolean'
    startCursor: 'String'
  }
  Post: { // field return type name
    author: 'User'
    authorId: 'ID'
    content: 'String'
    createdAt: 'DateTime'
    id: 'ID'
    published: 'Boolean'
    publishedAt: 'DateTime'
    title: 'String'
    updatedAt: 'DateTime'
  }
  PostEdge: { // field return type name
    cursor: 'String'
    node: 'Post'
  }
  Query: { // field return type name
    getMyPosts: 'QueryGetMyPosts_Connection'
    getPost: 'Post'
    getPublishedPosts: 'QueryGetPublishedPosts_Connection'
    getUser: 'User'
    getUserMe: 'User'
  }
  QueryGetMyPosts_Connection: { // field return type name
    edges: 'PostEdge'
    pageInfo: 'PageInfo'
    totalCount: 'Int'
  }
  QueryGetPublishedPosts_Connection: { // field return type name
    edges: 'PostEdge'
    pageInfo: 'PageInfo'
    totalCount: 'Int'
  }
  User: { // field return type name
    createdAt: 'DateTime'
    email: 'EmailAddress'
    id: 'ID'
    name: 'String'
    posts: 'UserPosts_Connection'
    role: 'Role'
    updatedAt: 'DateTime'
  }
  UserPosts_Connection: { // field return type name
    edges: 'PostEdge'
    pageInfo: 'PageInfo'
    totalCount: 'Int'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    changeUserRole: { // args
      id: string; // ID!
      role: NexusGenEnums['Role']; // Role!
    }
    createPost: { // args
      content: string; // String!
      title: string; // String!
    }
    deletePost: { // args
      id: string; // ID!
    }
    login: { // args
      email: NexusGenScalars['EmailAddress']; // EmailAddress!
      password: string; // String!
    }
    registerUser: { // args
      email: NexusGenScalars['EmailAddress']; // EmailAddress!
      name: string; // String!
      password: string; // String!
    }
    updatePost: { // args
      content?: string | null; // String
      id: string; // ID!
      setPublished?: boolean | null; // Boolean
      title?: string | null; // String
    }
  }
  Query: {
    getMyPosts: { // args
      after?: string | null; // String
      filter?: NexusGenInputs['GetMyPostsFilterInput'] | null; // GetMyPostsFilterInput
      first: number; // Int!
    }
    getPost: { // args
      id: string; // ID!
    }
    getPublishedPosts: { // args
      after?: string | null; // String
      filter?: NexusGenInputs['GetPublishedPostsFilterInput'] | null; // GetPublishedPostsFilterInput
      first: number; // Int!
    }
    getUser: { // args
      id: string; // ID!
    }
  }
  User: {
    posts: { // args
      after?: string | null; // String
      filter?: NexusGenInputs['UserPostsFilterInput'] | null; // UserPostsFilterInput
      first: number; // Int!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
    /**
     * Authorization for an individual field. Returning "true"
     * or "Promise<true>" means the field can be accessed.
     * Returning "false" or "Promise<false>" will respond
     * with a "Not Authorized" error for the field.
     * Returning or throwing an error will also prevent the
     * resolver from executing.
     */
    authorize?: FieldAuthorizeResolver<TypeName, FieldName>
    
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}