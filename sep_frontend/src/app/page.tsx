import Image from "next/image";
//import CustomLink from "./layout_components/CustomLink
import Link from "./layout_components/Link";

export default function Home() {
	return (
		<>
		<p>Welcome!</p>
		If you aren't logged in, please do so <Link href="/login">here</Link>
		</>
	);
}
