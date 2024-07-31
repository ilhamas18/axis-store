import Image from "next/image";

interface Waiting {
	headers?: string
	param?: string
}

const IconKosong = ({ headers, param }: Waiting) => {
	return (
		<div className="flex flex-col justify-center text-center items-center mx-12 mt-12">
			<Image
				src={'/esim/confirmation.svg'}
				width={158}
				height={231.84}
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

export default IconKosong;