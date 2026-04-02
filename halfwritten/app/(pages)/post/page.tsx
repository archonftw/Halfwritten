import Form from '@/PrivComponents/Form'
import ShowPostsServer from '@/PrivComponents/ShowPostsServer'

function page() {
  return (
    <div className='w-full h-screen flex '>
      <div className=' m-3 rounded-2xl outline w-3/4 overflow-auto '>
        <ShowPostsServer/>
      </div>
      <div className=' ml-5 mt-15 mb-3 mr-3 outline rounded-2xl w-1/4 flex p-5 justify-center'>
        <Form />
       </div>
    </div>
  ) 
}

export default page