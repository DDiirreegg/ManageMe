import React from 'react';
import { Story } from '../Models/Story';

interface StoryListProps {
  stories: Story[];
  onEditStory: (story: Story) => void;
  onDeleteStory: (storyId: string) => void;
  onAddStory: () => void;
  onViewStory: (story: Story) => void; 
}

const StoryList: React.FC<StoryListProps> = ({ stories, onEditStory, onDeleteStory, onAddStory, onViewStory }) => {
  return (
    <div>
      <button className="rounded-button" onClick={onAddStory}>New Story</button>
      <ul>
        {stories.map(story => (
          <li key={story.id}>
            <h3 onClick={() => onViewStory(story)} style={{ cursor: 'pointer' }}>{story.name}</h3>
            <p>{story.description}</p>
            <p>Priority: {story.priority}</p>
            <div className="story-buttons">
              <button className="rounded-button" onClick={() => onEditStory(story)}>Edit</button>
              <button className="rounded-button" onClick={() => onDeleteStory(story.id)}>Delete</button>
            </div>            
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoryList;
