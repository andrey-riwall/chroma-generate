(()=> {
	document.addEventListener('DOMContentLoaded', () => {
		const cols = document.querySelectorAll(".col");
	
		function setRandomColors(isInit) {
			const colors = isInit ? getColorFromHash() : [];
			
			cols.forEach((el, index) => {
				const isLocked = el.querySelector('i').classList.contains('fa-lock');
	
				const text = el.querySelector('h2');
				const btn = el.querySelector('button');
				const copy = el.querySelector('.copy');
				
				if(isLocked) {
					colors.push(text.textContent);
					return;
				}
	
				const color = isInit
					? colors[index]
						? colors[index]
						: chroma.random()
					: chroma.random();
	
				if(isInit && getColorFromHash().length != 5) {
					colors.push(color);
				}	else if(!isInit) {
					colors.push(color);
				}
				
				el.style.backgroundColor = color;
				text.textContent = color;
				setTextColor(text, color);
				setTextColor(btn, color);
				setTextColor(copy, color);
			});
			updateColorsHash(colors);
		}
	
		function setTextColor(text, color) {
			const luminance = chroma(color).luminance();
			text.style.color = luminance > 0.5 ? 'black' : 'white';
		}
	
		function copyToClipboard(text) {
		 navigator.clipboard.writeText(text);
	
			let box = document.querySelectorAll(".col .copy");
			box.forEach(el => {
				if(el.parentElement.children[0].textContent === text) {
					box = el.parentElement.children[1];
					return;
				}
			})
			const animate = box.animate([
				{ opacity: 0, position: 'absolute' },
				{ opacity: 1, position: 'static' },
			], 250);
			animate.addEventListener('finish', () => {
				box.style.position = 'static';
				box.style.opacity = 1;
				setTimeout(() => {
					box.style.opacity = 0;
				}, 1500)
				setTimeout(() => {
					box.style.position = 'absolute';
				}, 1750)
			});
		}
	
		function updateColorsHash(colors = []) {
			document.location.hash = colors.map(el => el.toString().substring(1)).join('-').toString();
		}
	
		function getColorFromHash() {
			if(document.location.hash.length > 1) {
				return document.location.hash.substring(1).split('-').map(el => '#' + el);
			}
			return [];
		}
	
		document.addEventListener('keydown', event => {
			event.preventDefault();
			if(event.code.toLowerCase() === 'space') {
				setRandomColors();
			}
		});
		const restart = document.querySelector(".restart");
		restart.addEventListener('click', event => {
			event.preventDefault();
			setRandomColors();
		});
	
		document.addEventListener('click', event => {
			const type = event.target.dataset.type;
	
			if(type === 'lock') {
				const node = 
					event.target.tagName.toLowerCase() === 'i'
						? event.target
						: event.target.children[0];
	
					node.classList.toggle('fa-lock-open');
					node.classList.toggle('fa-lock');
			} else if(type === 'copy') {
				copyToClipboard(event.target.textContent);
			}
		});
	
		setRandomColors(true);
	});
})();