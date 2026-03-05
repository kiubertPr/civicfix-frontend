import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import posts, { PostSection } from "../../posts";
import surveys, {SurveySection} from "../../surveys";
import users from "../../users";
import Home from "./Home";

const Feed = () => {

  const user = useSelector(users.selectors.getUser);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);

  dispatch(posts.actions.getFeed(activeTab, 0, 5, "date", "desc"));

  return (
      <Home>
        <div className="xl:w-5/8 lg:2/5 mt-20 lg:mt-0 w-full flex flex-col items-center">
          <div className="w-full text-md font-medium text-center text-gray-500 border-b border-gray-500 lg:mt-4">
              <ul className="flex flex-wrap -mb-px justify-center">
                <li 
                className={`w-auto flex-grow border-b-2 ${activeTab === 0 ? 
                "border-amber-500 text-amber-500" : "border-transparent hover:text-gray-600 hover:border-gray-400"} 
                rounded-t-lg cursor-pointer`} 
                onClick={() => setActiveTab(0)}>
                  <span className="inline-block p-4  rounded-t-lg">General</span>
                </li>
                <li className={`w-auto flex-grow border-b-2 ${activeTab === 1 ? 
                "border-amber-500 text-amber-500" : "border-transparent hover:text-gray-600 hover:border-gray-400"} 
                rounded-t-lg cursor-pointer`} 
                onClick={() => setActiveTab(1)}>
                  <span className="inline-block p-4 rounded-t-lg">Concello</span>
                </li>
                <li className={`w-auto flex-grow border-b-2 ${activeTab === 2 ? 
                "border-amber-500 text-amber-500" : "border-transparent hover:text-gray-600 hover:border-gray-400"} 
                rounded-t-lg cursor-pointer`} 
                onClick={() => setActiveTab(2)}>
                  <span className="inline-block p-4 rounded-t-lg">Encuestas</span>
                </li>
              </ul>
            </div>        
          {activeTab !=  2? (<PostSection activeTab={activeTab} />) : 
          (user? <SurveySection /> :
          <div className="text-gray-400 text-center py-8">Inicia sesión para ver las encuestas</div>)}
        </div>
      </Home>
    );
}

export default Feed;