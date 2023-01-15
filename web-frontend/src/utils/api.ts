import { fetchApi, Result, staticUrl } from '@innexgo/frontend-common'

export interface Info {
  service: string,
  versionMajor: number,
  versionMinor: number,
  versionRev: number,
  appPubOrigin: string,
  authServiceExternalUrl: string,
  authPubApiHref: string,
  authAuthenticatorHref: string,
}

export interface Article {
  articleId: number,
  creationTime: number,
  creatorUserId: number,
}


export interface Article {
  articleId: number,
  creationTime: number,
  creatorUserId: number,
}

export interface ArticleData {
  articleDataId: number,
  creationTime: number,
  creatorUserId: number,
  article: Article
  title: string,
  durationEstimate: number,
  active: boolean,
}

export interface ArticleSection {
  articleSectionId: number,
  creationTime: number,
  creatorUserId: number,
  article: Article,
  position: number,
  variant: number,
  sectionText: string,
  active: boolean,
}

export const AppErrorCodes = [
  "NO_CAPABILITY",
  "ARTICLE_NONEXISTENT",
  "ARTICLE_SECTION_NONEXISTENT",
  "INVALID_DURATION",
  "INVALID_POSITION",
  "DECODE_ERROR",
  "INTERNAL_SERVER_ERROR",
  "METHOD_NOT_ALLOWED",
  "UNAUTHORIZED",
  "BAD_REQUEST",
  "NOT_FOUND",
  "NETWORK",
  "UNKNOWN",
] as const;

// Creates a union type
export type AppErrorCode = typeof AppErrorCodes[number];

async function fetchApiOrNetworkError<T>(url: string, props: object): Promise<Result<T, AppErrorCode>> {
  try {
    const [code, resp] = await fetchApi(url, props);
    if (code >= 200 && code < 300) {
      return { Ok: resp }
    } else {
      return { Err: resp }
    }
  } catch (_) {
    return { Err: "NETWORK" };
  }
}

const undefToCriticaApi = (s: string | undefined) =>
  s === undefined ? `${staticUrl()}/public/` : s

export function info(server?: string): Promise<Result<Info, AppErrorCode>> {
  return fetchApiOrNetworkError(undefToCriticaApi(server) + "info", {});
}

export interface ArticleNewProps {
  title: string,
  durationEstimate: number,
  apiKey: string,
}

export function articleNew(props: ArticleNewProps, server?: string): Promise<Result<ArticleData, AppErrorCode>> {
  return fetchApiOrNetworkError(undefToCriticaApi(server) + "article/new", props);
}

export interface ArticleDataNewProps {
  articleId: number,
  title: string,
  durationEstimate: number,
  active: boolean,
  apiKey: string,
}

export function articleDataNew(props: ArticleDataNewProps, server?: string): Promise<Result<ArticleData, AppErrorCode>> {
  return fetchApiOrNetworkError(undefToCriticaApi(server) + "article_data/new", props);
}

export interface ArticleSectionNewProps {
  articleId: number,
  position: number,
  variant: number,
  sectionText: string,
  active: boolean,
  apiKey: string,
}

export function articleSectionNew(props: ArticleSectionNewProps, server?: string): Promise<Result<ArticleSection, AppErrorCode>> {
  return fetchApiOrNetworkError(undefToCriticaApi(server) + "article_section/new", props);
}


export interface ArticleViewProps {
  articleId?: number[],
  minCreationTime?: number,
  maxCreationTime?: number,
  creatorUserId?: number[],
  apiKey: string,
}

export function articleView(props: ArticleViewProps, server?: string): Promise<Result<Article[], AppErrorCode>> {
  return fetchApiOrNetworkError(undefToCriticaApi(server) + "article/view", props);
}

export interface ArticleDataViewProps {
  articleDataId?: number[],
  minCreationTime?: number,
  maxCreationTime?: number,
  creatorUserId?: number[],
  articleId?: number[],
  title?: string[],
  minDurationEstimate?: number,
  maxDurationEstimate?: number,
  active?: boolean,
  onlyRecent: boolean,
  apiKey: string,
}


export function articleDataView(props: ArticleDataViewProps, server?: string): Promise<Result<ArticleData[], AppErrorCode>> {
  return fetchApiOrNetworkError(undefToCriticaApi(server) + "article_data/view", props);
}

export interface ArticleSectionViewProps {
  articleSectionId?: number[],
  minCreationTime?: number,
  maxCreationTime?: number,
  creatorUserId?: number[],
  articleId?: number[],
  position?: number[],
  variant?: number[],
  active?: boolean,
  onlyRecent: boolean,
  apiKey: string,
}

export function articleSectionView(props: ArticleSectionViewProps, server?: string): Promise<Result<ArticleSection[], AppErrorCode>> {
  return fetchApiOrNetworkError(undefToCriticaApi(server) + "article_section/view", props);
}

export interface ArticleDataViewPublicProps {
  articleDataId?: number[],
  minCreationTime?: number,
  maxCreationTime?: number,
  creatorUserId?: number[],
  articleId?: number[],
  title?: string[],
  minDurationEstimate?: number,
  maxDurationEstimate?: number,
}

export function articleDataViewPublic(props: ArticleDataViewPublicProps, server?: string): Promise<Result<ArticleData[], AppErrorCode>> {
  return fetchApiOrNetworkError(undefToCriticaApi(server) + "article_data/view_public", props);
}

export interface ArticleSectionViewPublicProps {
  articleSectionId?: number[],
  minCreationTime?: number,
  maxCreationTime?: number,
  creatorUserId?: number[],
  articleId?: number[],
  position?: number[],
  variant?: number[],
}

export function articleSectionViewPublic(props: ArticleSectionViewPublicProps, server?: string): Promise<Result<ArticleSection[], AppErrorCode>> {
  return fetchApiOrNetworkError(undefToCriticaApi(server) + "article_section/view_public", props);
}

