import { prisma } from '$lib/server/prisma';
import { AuthErrorCode } from '$lib/utils/auth-error';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	if (!event.locals.session) return error(401, AuthErrorCode.AuthRequired);

	const { id: postId } = event.params;
	try {
		// check if the author's profile is private or the post is deleted
		const isValid = !(await prisma.post.findFirst({
			select: { id: true },
			where: {
				id: postId,
				OR: [{ author: { privacySettings: { private: true } } }, { deletedAt: { not: null } }]
			}
		}));
		if (!isValid) throw 0;

		const result = await prisma.$transaction([
			prisma.like.delete({
				where: {
					postId_profileId: {
						postId,
						profileId: event.locals.session.userId
					}
				}
			}),
			prisma.post.update({
				data: { likeCount: { decrement: 1 } },
				where: { id: postId },
				select: { likeCount: true }
			})
		]);

		return json({ data: result[1].likeCount });
	} catch {
		return error(500, 'Could not like post');
	}
};
