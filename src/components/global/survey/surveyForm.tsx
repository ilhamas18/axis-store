import Link from 'next/link';
import { FcNext } from 'react-icons/fc';

interface SurveyFormProps {
  isClickSurvey: boolean;
  setIsClickSurvey: any;
}

const SurveyForm = ({ isClickSurvey, setIsClickSurvey }: SurveyFormProps) => {
  return (
    <div className={`${isClickSurvey ? 'hidden' : 'block'}`} onClick={() => setIsClickSurvey(true)}>
      <Link href={'https://survey4.medallia.com/?websiteaxiscoid1'} target="_blank">
        <div className="p-4 bg-white rounded rounded-xl border border-light-gray shadow-lg my-4"> 
          <div className="flex items-center justify-between">
            <div className='flex gap-4 items-center'>
              <img src="/icons/survey.png" className="w-[50px]" alt="icon survey" />
              <div className="font-Museo-Medium md:text-md text-sm">Seberapa puas dengan proses transaksi di AXIS Store ?</div>
            </div>
            <div><FcNext size={20} /></div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default SurveyForm