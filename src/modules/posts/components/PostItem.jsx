import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react"; // Import useState

import { MapPin, ChevronDown, CalendarDays, Images, User } from 'lucide-react';

import * as actions from "../actions";
import { formatRelativeTime } from "../../common";

const PostItem = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSolvedContent, setShowSolvedContent] = useState(false); // New state for solved content visibility

  const handleClick = async (id) => {
    // Only allow click if not solved or if solved content is revealed
    if (!post.solved || showSolvedContent) {
      dispatch(actions.getPost(id, () => navigate('/posts/postDetail')));
    }
  }

  return (
    <div className="relative"> {/* Added relative positioning for the overlay */}
      <div
        className={`bg-gray-800 rounded-lg overflow-hidden shadow-sm shadow-black ${
          post.solved && !showSolvedContent ? 'filter blur-sm' : '' // Apply blur conditionally
        }`}
        onClick={() => handleClick(post.id)}
      >
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-white mb-2">{post.title}</h3>
            <span
              className={`text-xs px-2 py-1 rounded ${
                post.category === "ADMINISTRATION" ? "bg-red-900 text-white" : "bg-amber-600 text-gray-200"
              }`}
            >
              {post.category === "ADMINISTRATION" ? "Administración" : "Usuario"}
            </span>
          </div>
  
          <div className="text-sm text-gray-400 mt-1 flex items-center gap-2 mb-1">
            <MapPin size={20}/>
            {post.location}
          </div>
  
          <div className="text-sm text-gray-400 mt-1 flex items-center gap-2 mb">
            <CalendarDays size={20}/>
            {formatRelativeTime(post.date)}
          </div>
  
          <div className="mt-3 text-gray-300 line-clamp-3 text-justify">{post.content}</div>
  
          {post.content.length > 150 && (
            <button
              className="mt-2 text-sm text-blue-400 hover:text-blue-300 flex items-center gap-2"
            >
              Ver más
              <ChevronDown size={20} />
            </button>
          )}
  
          {post.images.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-1 mb-2 text-sm text-gray-400">
                <Images size={20}/>
                <span>
                  {post.images.length} {post.images.length === 1 ? "imagen" : "imágenes"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {post.images.slice(0, 4).map((img, index) => (
                  <img
                    key={index}
                    src={img || "/placeholder.svg"}
                    alt={`Imagen ${index + 1} de ${post.title}`}
                    className="rounded-md w-full h-auto object-cover max-h-[150px]"
                  />
                ))}
              </div>
              {post.images.length > 4 && (
                <button className="mt-2 text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded">
                  Ver {post.images.length - 4} imágenes más
                </button>
              )}
            </div>
          )}
        </div>
  
        <div className="border-t border-gray-700 px-4 py-3 flex items-center justify-between mt-6">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-600 mr-2 overflow-hidden">
              <img
                src={post.author.avatar || "/placeholder.svg"}
                alt={post.author.username}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <User size={20} />
              {post.author.username}
            </div>
          </div>

          {/* Sistema de votación */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-700 rounded-lg overflow-hidden">
              <div className={`px-3 py-2 ${post.votes >= 0 ? "text-green-400" : "text-red-400" } font-medium min-w-[2.5rem] text-center text-sm`}>
                {post.votes}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for solved posts */}
      {post.solved && !showSolvedContent && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg z-10 border border-gray-800">
          <div className="flex flex-col bg-gray-800 bg-opacity-80 p-4 rounded-lg text-center border border-gray-700">
            <h4 className="text-lg font-semibold text-white mb-2">Este post ha sido resuelto</h4>
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-lg font-semibold"
            onClick={(e) => {
              e.stopPropagation(); // Prevent click from propagating to the parent PostItem div
              setShowSolvedContent(true);
            }}
          >
            Ver post
          </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostItem;