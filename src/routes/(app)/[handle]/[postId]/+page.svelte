<script lang="ts">
	import { route } from '$lib/ROUTES';
	import { formatDate } from '$lib/utils/date';
	import { Button } from '&/button';
	import { PostContext, PostFooter } from '@/post';
	import { ProfileAvatar } from '@/profile';
	import { ChevronLeft } from 'lucide-svelte';
	import type { PageData } from './$types';

	const { data } = $props();
	const { postPromise, setPostForm }: PageData = data;
</script>

{#await postPromise}
	<!-- todo: skeleton -->
	<p>loading post</p>
{:then post}
	{#if post}
		<PostContext init={{ post, setPostForm }}>
			{#snippet children(postState)}
				<div class="p-4">
					<div class="mb-2 flex items-center gap-3 p-6">
						<ProfileAvatar profile={postState.post.author} />
						<div>
							<p class="font-semibold">{postState.post.author.displayName}</p>
							<Button
								variant="link"
								href={route('/[handle]', { handle: postState.post.author.handle })}
								class="h-0 p-0 text-sm text-gray-500"
							>
								@{postState.post.author.handle}
							</Button>
						</div>
					</div>
					<div class="p-6 pt-0">
						<p class="mb-4 text-xl">
							{postState.post.content}
						</p>
						<p class="mb-4 flex gap-1 text-sm text-muted-foreground">
							<span>
								{formatDate(postState.post.createdAt)}
							</span>
							{#if postState.post.edited}
								<span>·</span>
								<span>Edited</span>
							{/if}
						</p>
					</div>
					<div class="flex items-center justify-between p-6 py-3 pt-0">
						<PostFooter />
					</div>
				</div>
			{/snippet}
		</PostContext>
	{:else}
		<div class="flex h-full flex-col items-center justify-center gap-3">
			<h1 class="fo nt-bold text-3xl">Uh oh, we couldn't find this post</h1>
			<Button variant="link" href={route('/')}>
				<ChevronLeft />
				<h1 class="ml-2 text-xl">Go back home</h1>
			</Button>
		</div>
	{/if}
{/await}
