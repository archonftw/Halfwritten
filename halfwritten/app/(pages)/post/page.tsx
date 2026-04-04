import Form from '@/PrivComponents/Form'
import ShowPostsServer from '@/PrivComponents/ShowPostsServer'

function page() {
  return (
    <div className='w-full min-h-screen flex flex-col md:flex-row overflow-auto'>
      
      {/* Posts Panel — full width on mobile, 3/4 on desktop */}
      <div className='w-full md:w-3/4 m-2 md:m-3 rounded-2xl outline overflow-auto order-2 md:order-1'>
        <ShowPostsServer />
      </div>

      {/* Form Panel — full width on mobile, 1/4 on desktop */}
      <div className='w-full md:w-1/4 mx-2 mt-3 mb-0 md:ml-5 md:mt-15 md:mb-3 md:mr-3 outline rounded-2xl flex p-4 md:p-5 justify-center order-1 md:order-2'>
        <Form />
      </div>

    </div>
  )
}

export default page