<script lang="ts">
	import type { SetPostSchema } from '$lib/schemas/post/set-post';
	import * as Form from '&/form';
	import { Textarea } from '&/textarea';
	import { getAuthState } from '@/auth';
	import type { Infer, SuperForm } from 'sveltekit-superforms';

	interface Props {
		form: SuperForm<Infer<SetPostSchema>>;
	}

	const { form }: Props = $props();
	const { form: formData, constraints } = form;

	const authState = getAuthState();

	const MAX_LINES = 20;
	const MIN_LINES = 5;

	const getRows = () => {
		const lines = content.split('\n').length;
		return Math.max(MIN_LINES, Math.min(lines, MAX_LINES));
	};

	const content = $derived($formData.content.trimEnd());
	const rows: number = $derived(getRows());
</script>

<Form.Field {form} name="content" class="relative">
	<Form.Control let:attrs>
		<Textarea
			{...attrs}
			bind:value={$formData.content as string}
			{rows}
			class="resize-none text-lg"
			minlength={$constraints.content?.minlength}
			maxlength={$constraints.content?.maxlength}
			placeholder="What's up {authState.profile?.displayName ?? 'Stranger'} ?"
			required
		/>
		<p class="pointer-events-none absolute bottom-0 right-0 self-center p-2 text-muted-foreground">
			{content.length}/{$constraints.content?.maxlength}
		</p>
	</Form.Control>
</Form.Field>
