import { ArrowTopRightOnSquareIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import TButton from './core/TButton';

export default function GymListItem({ gym, onDeleteClick }) {
    const [showFullDescription, setShowFullDescription] = useState(false);
    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    return (
        <div className="flex flex-col py-4 px-6 shadow-md bg-white hover:bg-gray-50 h-[470px]">
            <img
                src={gym.image_url}
                alt={`${gym.name} Gym`}
                className="w-full h-48 object-cover"
            />
            <h4 className="mt-4 text-lg font-bold">{gym.name}</h4>
            <div className="overflow-hidden flex-1">
                <div
                    dangerouslySetInnerHTML={{
                        __html: showFullDescription ? gym.description : `${gym.description.substring(0, 25)}...`,
                    }}
                />
                {gym.description.length > 25 && (
                    <button onClick={toggleDescription} className="text-blue-500 underline mt-2">
                        {showFullDescription ? 'Show less' : 'Show more'}
                    </button>
                )}
            </div>
            <div className="mt-4">
                <div className="font-semibold mb-2">
                    <span>Address: </span>
                    <span dangerouslySetInnerHTML={{ __html: gym.address }} />
                    <span>, {gym.cityName}</span>
                </div>
                <div className="flex justify-between items-center">
                    <TButton to={`gyms/${gym.id}`}>
                        <PencilIcon className="w-5 h-5 mr-2" />
                        Edit
                    </TButton>
                    <div className="flex items-center">
                        <TButton href={`/view/gyms/${gym.slug}`} circle link>
                            <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                        </TButton>
                        {gym.id && (
                            <TButton onClick={onDeleteClick} circle link color="red">
                                <TrashIcon className="w-5 h-5" />
                            </TButton>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}