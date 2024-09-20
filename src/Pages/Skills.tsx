import { useMutation } from '@apollo/client';
import { Button } from '@nextui-org/react';
import { message, Rate } from 'antd';
import { useState } from 'react';
import type { MultiValue, StylesConfig } from 'react-select';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import SkillList from '../Constant/Skills';
import { ADD_SKILL_MUTAION } from '../GraphQL/Mutations/Profile/Skills';

interface SkillOption {
  label: string;
  value: string;
}

const customStyles: StylesConfig<SkillOption, true> = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'transparent',
    borderColor: state.isFocused ? 'bg-gray-800' : 'gray',
    boxShadow: 'none',
  }),
  menu: provided => ({
    ...provided,
    backgroundColor: '#1f2937',
  }),
};

const Skills: React.FC = () => {
  const [selectedSkills, setSelectedSkills] = useState<MultiValue<SkillOption>>([]);
  const [rates, setRates] = useState<{ [key: string]: number }>({});
  const animatedComponents = makeAnimated();

  const [createSkill, { loading, error }] = useMutation(ADD_SKILL_MUTAION, {
    onCompleted: () => {
      setSelectedSkills([]);
      setRates({});
      message.success('Skills added successfully');
    },
  });

  const handleCreateSkills = () => {
    selectedSkills.forEach(skill => {
      createSkill({
        variables: {
          title: skill.value,
          proficiency: rates[skill.value] || 0,
        },
      });
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 font-mono flex p-4 sm:p-6 md:p-8 ml-0 min-[320px]:ml-16 min-[760px]:ml-40">
      <div className="w-full relative max-w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden mx-auto sm:mx-4 md:mx-8">
        <div className="p-4 bg-gray-700 border-b border-gray-600">
          <h2 className="text-xl font-semibold">
            Add Skills<span className="text-yellow-400">{` {`}</span>
          </h2>
        </div>
        <div>
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            placeholder="Select Skills"
            isMulti
            options={SkillList}
            value={selectedSkills}
            onChange={e => setSelectedSkills(e)}
            className="w-full"
            styles={customStyles}
          />
        </div>
        <div className="p-4 overflow-auto max-h-[69vh]">
          <h3 className="text-lg font-semibold">
            Skills <span className="text-yellow-400">{`[`}</span>
          </h3>
          <ul className="list-inside mt-2">
            {selectedSkills.map(skill => (
              <div key={skill.label}>
                <span>{`{`}</span>
                <li key={skill.value}>Name: {skill.label},</li>
                <div>
                  Proficiency:{' '}
                  <Rate
                    character={({ index = 0 }) => index + 1}
                    value={rates[skill.value]}
                    onChange={e => setRates({ ...rates, [skill.value]: e })}
                    className="text-sm"
                  />
                </div>
                <span>{`}`}</span>
              </div>
            ))}
          </ul>
          <h3 className="text-lg font-semibold text-yellow-400">{`];`}</h3>
        </div>
        <div className="pt-4">
          <Button
            type="submit"
            color="success"
            onClick={handleCreateSkills}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? 'Compiling...' : 'Run Skills.create()'}
          </Button>
        </div>
        {error && <p className="text-red-500 mt-2">{`// Error: ${error.message}`}</p>}
        <div className="p-4 bg-gray-700 border-b border-gray-600 absolute w-full bottom-0">
          <h2 className="text-xl font-semibold text-yellow-400">{`};`}</h2>
        </div>
      </div>
    </div>
  );
};

export default Skills;
