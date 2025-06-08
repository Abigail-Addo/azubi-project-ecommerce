

import React from "react"
import Image from 'next/image';


const Loading = () => {
    return (
        <>
            <div className='w-screen h-screen flex items-center justify-center'>
                <Image
                    src="/spinner/loading.gif"
                    className='w-40 h-28 flex mx-auto my-auto'
                    width={300}
                    height={300}
                    alt="Loading..."
                    priority
                />
            </div>
        </>
    )
}

export default Loading


