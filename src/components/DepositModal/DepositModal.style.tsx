import tw from 'twin.macro'

export const ModalOuterWrapper = tw.div`
    fixed inset-0 z-50 flex items-center justify-center overflow-y-auto 
    overflow-x-hidden outline-none focus:outline-none
`

export const ModalInnerWrapper = tw.div`
    relative my-6 flex flex-col rounded-xl bg-white 
    shadow-xl outline-none focus:outline-none w-screen sm:w-2/3 lg:w-1/2
    dark:bg-gray-800 border dark:border-prize-dark-gray mx-2
`

export const ModalBackground = tw.div`
    fixed inset-0 z-40 bg-black opacity-60
`

export const ModalHeaderWrapper = tw.div`
    space-y-1 border-b p-5 text-center dark:border-prize-dark-gray
`

export const ModalContentWrapper = tw.div`
    relative space-y-5 p-5 sm:px-14 text-center
`

export const ModalFooterWrapper = tw.div`
    flex items-center justify-end pb-5
`
