interface HeadingProps {
  description: string;
  title: string;
}

export const Heading: React.FC<HeadingProps> = ({ description, title }) => {
  return (
    <div>
      <h2 className='text-3xl font-bold tracking-tight'>{title}</h2>
      <p className='text-muted-foreground text-sm'>{description}</p>
    </div>
  );
};
