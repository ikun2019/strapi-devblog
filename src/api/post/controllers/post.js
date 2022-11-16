'use strict';

/**
 * post controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::post.post', ({ strapi }) => ({
    async exampleAction(ctx) {
        await strapi.service("api::post.post").exampleService({ myParams: 'example' });
        try {
            ctx.body = 'ok';
        } catch (err) {
            ctx.body = err;
        }
    },

    // Solution1: fetched all posts and filtered them afterwords
    // async find(ctx) {
    //     const { data, meta } = await super.find(ctx);
    //     // 認証済みユーザーの場合
    //     if (ctx.state.user) {
    //         return { data, meta };
    //     }
    //     // 認証済みユーザーではない場合
    //     const filteredData = data.filter((post) => !post.attributes.premium);
    //     return { data: filteredData, meta };
    // },

    // Solution2: rewrite the action to fetch only needed posts
    // async find(ctx) {
    //     // if the request is authenticated
    //     const isRequestingNonPremium = ctx.query.filters && ctx.query.filters.premium == false;
    //     console.log(ctx.query)
    //     if (ctx.state.user || isRequestingNonPremium) {
    //         return await super.find(ctx);
    //     }
    //     // if the request is public
    //     const { query } = ctx;
    //     const filteredPosts = await strapi.service("api::post.post").find({
    //         ...query,
    //         filters: {
    //             ...query.filters,
    //             premium: false
    //         }
    //     });
    //     const sanitizedPosts = await this.sanitizeOutput(filteredPosts, ctx);
    //     return this.transformResponse(sanitizedPosts);
    // },

    // 
    async find(ctx) {
        // if the request is authenticated or explicitly asking for public content only
        const isRequestingNonPremium = ctx.query.filters && ctx.query.filters.premium == false;
        console.log(ctx.query)
        if (ctx.state.user || isRequestingNonPremium) {
            return await super.find(ctx);
        }
        // if the request is public
        const publicPosts = await strapi.service("api::post.post").findPublic(ctx.query);
        const sanitizedPosts = await this.sanitizeOutput(publicPosts, ctx);
        return this.transformResponse(sanitizedPosts);
    },

    // Method 3: Replacing a core action
    // async findOne(ctx) {
    //     const { id } = ctx.params;
    //     const { query } = ctx;

    //     const entity = await strapi.service('api::post.post').findOne(id, query);
    //     const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    //     return this.transformResponse(sanitizedEntity);
    // },

    // Method 3: Replacing a core action
    async findOne(ctx) {
        if (ctx.state.user) return await super.findOne(ctx);
        // else
        const { id } = ctx.params;
        const { query } = ctx;
        const postIfPublic = await strapi.service("api::post.post").findOneIfPublic({
            id,
            query
        });
        const sanitizedEntity = await this.sanitizeOutput(postIfPublic, ctx);
        return this.transformResponse(sanitizedEntity);
    },

    async likePost(ctx) {
        const user = ctx.state.user;
        console.log(user);
        const postId = ctx.params.id;
        const { query } = ctx;
        const updatedPost = await strapi.service("api::post.post").likePost({
            postId,
            userId: user.id,
            query
        });
        const sanitizedEntity = await this.sanitizeOutput(updatedPost, ctx);
        return this.transformResponse(sanitizedEntity);
    }
}));
