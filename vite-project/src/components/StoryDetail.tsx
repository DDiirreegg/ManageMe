import React from 'react';
import { Story } from '../Models/Story';
import { Task } from '../Models/Task';

interface StoryDetailProps {
  story: Story;
  tasks: Task[];
  onBack: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (storyId: string, taskId: string) => void;
  onAddTask: () => void;
}

const StoryDetail: React.FC<StoryDetailProps> = ({ story, tasks, onBack, onEditTask, onDeleteTask, onAddTask }) => {
  return (
    <div>
      <button className="rounded-button" onClick={onBack}>Back to Stories</button>
      <h2>{story.name}</h2>
      <p>{story.description}</p>
      <p>Priority: {story.priority}</p>
      <p>Status: {story.status}</p>
      <p>Created At: {story.createdAt.toLocaleDateString()}</p>

      <button className="rounded-button" onClick={onAddTask}>Add Task</button>

      <h3>Tasks</h3>
      {tasks.length > 0 ? (
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              <h4>Task: {task.name}</h4>
              <p>Description: {task.description}</p>
              <p>Hours: {task.estimatedHours}</p>
              <p>Priority: {task.priority}</p>
              <p>Status: {task.status}</p>              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="rounded-button" onClick={() => onEditTask(task)}>Edit</button>
                <button className="rounded-button" onClick={() => onDeleteTask(story.id, task.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks available.</p>
      )}
    </div>
  );
};

export default StoryDetail;
