export default function changeAvatar(preview: HTMLImageElement) {
	const tmp = document.createElement("input");
	tmp.type = "file";
	tmp.style.position = "absolute";
	tmp.style.visibility = "hidden";
	tmp.accept = "image/*";
	tmp.addEventListener("change", function (e) {
		const image = this.files?.[0];
		if (image?.type.includes("image")) {
			const fileReader = new FileReader();
			fileReader.readAsDataURL(image);
			fileReader.onload = (fileReaderEvent) => {
				preview.src = `${fileReaderEvent.target?.result}`;
				document.querySelector("#root")?.removeChild(tmp);
			};
		} else {
			document.querySelector("#root")?.removeChild(tmp);
		}
	});
	document.querySelector("#root")?.appendChild(tmp);
	tmp.click();
}
