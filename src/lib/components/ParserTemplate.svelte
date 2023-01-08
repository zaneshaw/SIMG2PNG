<script lang="ts">
	export let inputLabel: string;
	export let inputFileType: string;
	export let input: HTMLInputElement;
	export let doExport: boolean;
</script>

<div class="flex justify-center">
	<div class="flex flex-col gap-1 items-end">
		<div class="form-control w-72">
			<label for="fileinput" class="label">
				<span class="label-text">{inputLabel}</span>
				<span class="label-text-alt">{inputFileType.toUpperCase()}</span>
			</label>
			<input
				type="file"
				accept={inputFileType}
				id="fileinput"
				class="file-input file-input-md file-input-bordered"
				bind:this={input}
			/>
		</div>
		<div class="flex gap-1">
			<button
				class="btn btn-sm btn-info"
				on:click
				on:click={() => {
					doExport = false;
				}}
			>
				Parse
			</button>
			<button
				class="btn btn-sm"
				on:click
				on:click={() => {
					doExport = true;
				}}>Parse + Export</button
			>
		</div>
	</div>
</div>
