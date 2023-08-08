declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';
	export type CollectionEntry<C extends keyof AnyEntryMap> = AnyEntryMap[C][keyof AnyEntryMap[C]];

	// TODO: Remove this when having this fallback is no longer relevant. 2.3? 3.0? - erika, 2023-04-04
	/**
	 * @deprecated
	 * `astro:content` no longer provide `image()`.
	 *
	 * Please use it through `schema`, like such:
	 * ```ts
	 * import { defineCollection, z } from "astro:content";
	 *
	 * defineCollection({
	 *   schema: ({ image }) =>
	 *     z.object({
	 *       image: image(),
	 *     }),
	 * });
	 * ```
	 */
	export const image: never;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<
				import('astro/zod').AnyZodObject,
				import('astro/zod').AnyZodObject
		  >;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {})
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {})
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
			  }
			: {
					collection: C;
					id: keyof DataEntryMap[C];
			  }
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"pamatky": {
"trasa-a/1-cafe-herzog.md": {
	id: "trasa-a/1-cafe-herzog.md";
  slug: "trasa-a/1-cafe-herzog";
  body: string;
  collection: "pamatky";
  data: any
} & { render(): Render[".md"] };
"trasa-a/10-klasterni-zahrada.md": {
	id: "trasa-a/10-klasterni-zahrada.md";
  slug: "trasa-a/10-klasterni-zahrada";
  body: string;
  collection: "pamatky";
  data: any
} & { render(): Render[".md"] };
"trasa-a/11-schrolluv-park.md": {
	id: "trasa-a/11-schrolluv-park.md";
  slug: "trasa-a/11-schrolluv-park";
  body: string;
  collection: "pamatky";
  data: any
} & { render(): Render[".md"] };
"trasa-a/12-vila-josefa-dimtera.md": {
	id: "trasa-a/12-vila-josefa-dimtera.md";
  slug: "trasa-a/12-vila-josefa-dimtera";
  body: string;
  collection: "pamatky";
  data: any
} & { render(): Render[".md"] };
"trasa-a/13-cisarska-ulice.md": {
	id: "trasa-a/13-cisarska-ulice.md";
  slug: "trasa-a/13-cisarska-ulice";
  body: string;
  collection: "pamatky";
  data: any
} & { render(): Render[".md"] };
"trasa-a/14-vila-augusta-schrolla.md": {
	id: "trasa-a/14-vila-augusta-schrolla.md";
  slug: "trasa-a/14-vila-augusta-schrolla";
  body: string;
  collection: "pamatky";
  data: any
} & { render(): Render[".md"] };
"trasa-a/15-vila-benedikta-schrolla.md": {
	id: "trasa-a/15-vila-benedikta-schrolla.md";
  slug: "trasa-a/15-vila-benedikta-schrolla";
  body: string;
  collection: "pamatky";
  data: any
} & { render(): Render[".md"] };
"trasa-a/16-vila-margot-rosslerove.md": {
	id: "trasa-a/16-vila-margot-rosslerove.md";
  slug: "trasa-a/16-vila-margot-rosslerove";
  body: string;
  collection: "pamatky";
  data: any
} & { render(): Render[".md"] };
"trasa-a/17-vila-josefa-kaulicha.md": {
	id: "trasa-a/17-vila-josefa-kaulicha.md";
  slug: "trasa-a/17-vila-josefa-kaulicha";
  body: string;
  collection: "pamatky";
  data: any
} & { render(): Render[".md"] };
"trasa-a/18-vila-franze-scholze.md": {
	id: "trasa-a/18-vila-franze-scholze.md";
  slug: "trasa-a/18-vila-franze-scholze";
  body: string;
  collection: "pamatky";
  data: any
} & { render(): Render[".md"] };
"trasa-a/19-vila-colestina-klemta.md": {
	id: "trasa-a/19-vila-colestina-klemta.md";
  slug: "trasa-a/19-vila-colestina-klemta";
  body: string;
  collection: "pamatky";
  data: any
} & { render(): Render[".md"] };
"trasa-a/2-park-alejka.md": {
	id: "trasa-a/2-park-alejka.md";
  slug: "trasa-a/2-park-alejka";
  body: string;
  collection: "pamatky";
  data: any
} & { render(): Render[".md"] };
"trasa-a/20-seidluv-hostinec.md": {
	id: "trasa-a/20-seidluv-hostinec.md";
  slug: "trasa-a/20-seidluv-hostinec";
  body: string;
  collection: "pamatky";
  data: any
} & { render(): Render[".md"] };
"trasa-a/21-vila-josefa-edlera-von-schrolla.md": {
	id: "trasa-a/21-vila-josefa-edlera-von-schrolla.md";
  slug: "trasa-a/21-vila-josefa-edlera-von-schrolla";
  body: string;
  collection: "pamatky";
  data: any
} & { render(): Render[".md"] };
"trasa-a/22-langer-schrollova-vila.md": {
	id: "trasa-a/22-langer-schrollova-vila.md";
  slug: "trasa-a/22-langer-schrollova-vila";
  body: string;
  collection: "pamatky";
  data: any
} & { render(): Render[".md"] };
"trasa-a/23-hotel-birke.md": {
	id: "trasa-a/23-hotel-birke.md";
  slug: "trasa-a/23-hotel-birke";
  body: string;
  collection: "pamatky";
  data: any
} & { render(): Render[".md"] };
"trasa-a/24-drogerie-skolnik.md": {
	id: "trasa-a/24-drogerie-skolnik.md";
  slug: "trasa-a/24-drogerie-skolnik";
  body: string;
  collection: "pamatky";
  data: any
} & { render(): Render[".md"] };
"trasa-a/3-lachneruv-dum.md": {
	id: "trasa-a/3-lachneruv-dum.md";
  slug: "trasa-a/3-lachneruv-dum";
  body: string;
  collection: "pamatky";
  data: any
} & { render(): Render[".md"] };
"trasa-a/4-vila-oskara-nowotneho.md": {
	id: "trasa-a/4-vila-oskara-nowotneho.md";
  slug: "trasa-a/4-vila-oskara-nowotneho";
  body: string;
  collection: "pamatky";
  data: any
} & { render(): Render[".md"] };
"trasa-a/5-vila-roberta-stowassera.md": {
	id: "trasa-a/5-vila-roberta-stowassera.md";
  slug: "trasa-a/5-vila-roberta-stowassera";
  body: string;
  collection: "pamatky";
  data: any
} & { render(): Render[".md"] };
"trasa-a/6-hostinec-husarsky-zamek.md": {
	id: "trasa-a/6-hostinec-husarsky-zamek.md";
  slug: "trasa-a/6-hostinec-husarsky-zamek";
  body: string;
  collection: "pamatky";
  data: any
} & { render(): Render[".md"] };
"trasa-a/7-fotoatelier-a-bytovy-dum-georga-hoppeho.md": {
	id: "trasa-a/7-fotoatelier-a-bytovy-dum-georga-hoppeho.md";
  slug: "trasa-a/7-fotoatelier-a-bytovy-dum-georga-hoppeho";
  body: string;
  collection: "pamatky";
  data: any
} & { render(): Render[".md"] };
"trasa-a/8-dum-socialni-vybavenosti.md": {
	id: "trasa-a/8-dum-socialni-vybavenosti.md";
  slug: "trasa-a/8-dum-socialni-vybavenosti";
  body: string;
  collection: "pamatky";
  data: any
} & { render(): Render[".md"] };
"trasa-a/9-mestanska-sladovna.md": {
	id: "trasa-a/9-mestanska-sladovna.md";
  slug: "trasa-a/9-mestanska-sladovna";
  body: string;
  collection: "pamatky";
  data: any
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = never;
}
