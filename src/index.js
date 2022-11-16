'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    const extensionService = strapi.plugin('graphql').service('extension');
    // extensionService.shadowCRUD('api::post.post').disable();
    // extensionService.shadowCRUD('api::post.post').disableQueries();
    // extensionService.shadowCRUD('api::post.post').disableMutations();
    // extensionService.shadowCRUD('api::tag.tag').disableActions(['update']);
    const extension = ({ nexus }) => ({
      typeDefs: `
        type Mutation {
          likePost(id: ID!): PostEntityResponse
        }
      `,
      resolvers: {
        Mutation: {
          likePost: async (parent, args, ctx, info) => {
            // resolver imprementation
            const { id: postId } = args;
            const userId = ctx.state.user.id;
            const likedPost = await strapi
              .service("api::post.post")
              .likePost({ postId, userId });
            return likedPost;
          },
        },
      },
      resolversConfig: {
        "Mutation.likePost": {
          auth: false,
        }
      }
    });
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) { },
};
