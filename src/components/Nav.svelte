<script>
	export let segment;
</script>

<nav>
	<ul>
		<li>
			<a aria-current='{segment === undefined ? "page" : undefined}' href='.'>
			home
			</a>
		</li>
		<li>
			<a aria-current='{segment === "about" ? "page" : undefined}' href='about'>
			about
			</a>
		</li>
	</ul>
</nav>
