import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Match = {
  __typename?: 'Match';
  user1?: Maybe<User>;
  user2?: Maybe<User>;
};

export type Matching = {
  __typename?: 'Matching';
  roomId?: Maybe<Scalars['ID']['output']>;
  users?: Maybe<Array<Maybe<UserInfo>>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addUser?: Maybe<User>;
  findMatch?: Maybe<Scalars['String']['output']>;
  generateQrCode?: Maybe<QrCode>;
  getQrCodes?: Maybe<QrCodes>;
  getUsersQrCodes?: Maybe<QrCodes>;
  selectCard?: Maybe<Scalars['Int']['output']>;
};


export type MutationAddUserArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
  room_id?: InputMaybe<Scalars['ID']['input']>;
  user_id?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationFindMatchArgs = {
  user_id?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationGenerateQrCodeArgs = {
  content: Scalars['String']['input'];
  qrcode_name: Scalars['String']['input'];
};


export type MutationGetQrCodesArgs = {
  count: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  user_id: Scalars['String']['input'];
};


export type MutationGetUsersQrCodesArgs = {
  count: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  user_ids: Scalars['String']['input'];
};


export type MutationSelectCardArgs = {
  num?: InputMaybe<Scalars['Int']['input']>;
  roomId: Scalars['ID']['input'];
};

export type QrCode = {
  __typename?: 'QrCode';
  error?: Maybe<Scalars['String']['output']>;
  qrcode_content?: Maybe<Scalars['String']['output']>;
  qrcode_id?: Maybe<Scalars['String']['output']>;
  qrcode_url?: Maybe<Scalars['String']['output']>;
  user_id?: Maybe<Scalars['String']['output']>;
};

export type QrCodes = {
  __typename?: 'QrCodes';
  error?: Maybe<Scalars['String']['output']>;
  qrcodes?: Maybe<Array<Maybe<QrCode>>>;
};

export type Query = {
  __typename?: 'Query';
  HelloSquare: Scalars['String']['output'];
  waitingUsers?: Maybe<Array<Maybe<User>>>;
};

export type Subscription = {
  __typename?: 'Subscription';
  matching?: Maybe<Matching>;
  selectNum: Scalars['Int']['output'];
};


export type SubscriptionSelectNumArgs = {
  roomId: Scalars['ID']['input'];
};

export type User = {
  __typename?: 'User';
  name?: Maybe<Scalars['String']['output']>;
  room_id?: Maybe<Scalars['String']['output']>;
  user_id?: Maybe<Scalars['ID']['output']>;
};

export type UserInfo = {
  __typename?: 'UserInfo';
  name?: Maybe<Scalars['String']['output']>;
  offer?: Maybe<Scalars['Boolean']['output']>;
  room_id?: Maybe<Scalars['String']['output']>;
  user_id?: Maybe<Scalars['ID']['output']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Match: ResolverTypeWrapper<Match>;
  Matching: ResolverTypeWrapper<Matching>;
  Mutation: ResolverTypeWrapper<{}>;
  QrCode: ResolverTypeWrapper<QrCode>;
  QrCodes: ResolverTypeWrapper<QrCodes>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  User: ResolverTypeWrapper<User>;
  UserInfo: ResolverTypeWrapper<UserInfo>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Match: Match;
  Matching: Matching;
  Mutation: {};
  QrCode: QrCode;
  QrCodes: QrCodes;
  Query: {};
  String: Scalars['String']['output'];
  Subscription: {};
  User: User;
  UserInfo: UserInfo;
};

export type MatchResolvers<ContextType = any, ParentType extends ResolversParentTypes['Match'] = ResolversParentTypes['Match']> = {
  user1?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  user2?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MatchingResolvers<ContextType = any, ParentType extends ResolversParentTypes['Matching'] = ResolversParentTypes['Matching']> = {
  roomId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  users?: Resolver<Maybe<Array<Maybe<ResolversTypes['UserInfo']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, Partial<MutationAddUserArgs>>;
  findMatch?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, Partial<MutationFindMatchArgs>>;
  generateQrCode?: Resolver<Maybe<ResolversTypes['QrCode']>, ParentType, ContextType, RequireFields<MutationGenerateQrCodeArgs, 'content' | 'qrcode_name'>>;
  getQrCodes?: Resolver<Maybe<ResolversTypes['QrCodes']>, ParentType, ContextType, RequireFields<MutationGetQrCodesArgs, 'count' | 'page' | 'user_id'>>;
  getUsersQrCodes?: Resolver<Maybe<ResolversTypes['QrCodes']>, ParentType, ContextType, RequireFields<MutationGetUsersQrCodesArgs, 'count' | 'page' | 'user_ids'>>;
  selectCard?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, RequireFields<MutationSelectCardArgs, 'roomId'>>;
};

export type QrCodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['QrCode'] = ResolversParentTypes['QrCode']> = {
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  qrcode_content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  qrcode_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  qrcode_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QrCodesResolvers<ContextType = any, ParentType extends ResolversParentTypes['QrCodes'] = ResolversParentTypes['QrCodes']> = {
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  qrcodes?: Resolver<Maybe<Array<Maybe<ResolversTypes['QrCode']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  HelloSquare?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  waitingUsers?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  matching?: SubscriptionResolver<Maybe<ResolversTypes['Matching']>, "matching", ParentType, ContextType>;
  selectNum?: SubscriptionResolver<ResolversTypes['Int'], "selectNum", ParentType, ContextType, RequireFields<SubscriptionSelectNumArgs, 'roomId'>>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  room_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user_id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserInfo'] = ResolversParentTypes['UserInfo']> = {
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  offer?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  room_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user_id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Match?: MatchResolvers<ContextType>;
  Matching?: MatchingResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  QrCode?: QrCodeResolvers<ContextType>;
  QrCodes?: QrCodesResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserInfo?: UserInfoResolvers<ContextType>;
};

