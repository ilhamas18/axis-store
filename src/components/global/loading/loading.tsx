import Image from "next/image";

interface Waiting {
	headers?: string
	param?: string
}

const IconWaiting = ({ headers, param }: Waiting) => {
	return (
		<div className="flex flex-col justify-center text-center items-center mx-12 mt-10">
			<Image
				src={'/esim/time.svg'}
				width={128}
				height={151.84}
				alt="Icon loading"
			/>

			<>
				<h3 className="font-bold my-4 text-xl tracking-wider mt-4 mb-4 md:text-2xl text-lg">{headers}</h3>
				<div className="text-xs tracking-wider md:text-sm text-xs"
					dangerouslySetInnerHTML={{
						__html: `${param}`
					}}
				>
				</div>
			</>
		</div>
	);
}

export default IconWaiting;