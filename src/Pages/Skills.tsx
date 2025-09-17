import { useMutation } from '@apollo/client';
import { Button } from '@nextui-org/react';
import { toast } from 'sonner';
import { Rate } from 'antd';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Star, Plus, Zap, Award } from 'lucide-react';
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
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    borderColor: state.isFocused ? '#8b5cf6' : '#475569',
    boxShadow: state.isFocused ? '0 0 0 1px #8b5cf6' : 'none',
    '&:hover': {
      borderColor: '#64748b',
    },
  }),
  menu: provided => ({
    ...provided,
    backgroundColor: '#1e293b',
    border: '1px solid #475569',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#8b5cf6' : state.isFocused ? '#334155' : 'transparent',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#334155',
    },
  }),
  multiValue: provided => ({
    ...provided,
    backgroundColor: '#8b5cf6',
  }),
  multiValueLabel: provided => ({
    ...provided,
    color: '#ffffff',
  }),
  multiValueRemove: provided => ({
    ...provided,
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#7c3aed',
      color: '#ffffff',
    },
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
      toast.success('Skills added successfully');
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
    <div className="min-h-screen ml-16 lg:ml-64 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Skills</h1>
              <p className="text-slate-400">Showcase your technical expertise</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Skills Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Add Skills</h2>
                  <p className="text-slate-400 text-sm">Select and rate your skills</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Select Skills</label>
                <Select
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  placeholder="Search and select skills..."
                  isMulti
                  options={SkillList}
                  value={selectedSkills}
                  onChange={e => setSelectedSkills(e)}
                  className="w-full"
                  styles={customStyles}
                />
              </div>

              {/* Selected Skills with Rating */}
              {selectedSkills.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-400" />
                    Rate Your Skills
                  </h3>
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {selectedSkills.map((skill, index) => (
                      <motion.div
                        key={skill.value}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-slate-700/30 border border-slate-600/50 rounded-xl"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-white">{skill.label}</h4>
                          <span className="text-slate-400 text-sm">
                            {rates[skill.value] ? `${rates[skill.value]}/5` : 'Not rated'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 text-sm">Proficiency:</span>
                          <Rate
                            value={rates[skill.value]}
                            onChange={e => setRates({ ...rates, [skill.value]: e })}
                            className="text-emerald-400"
                            character={<Star className="w-4 h-4" />}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-4">
                <Button
                  onClick={handleCreateSkills}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 shadow-lg hover:shadow-emerald-500/25"
                  disabled={loading || selectedSkills.length === 0}
                  startContent={
                    loading ? (
                      <Zap className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )
                  }
                >
                  {loading
                    ? 'Adding Skills...'
                    : `Add ${selectedSkills.length} Skill${selectedSkills.length !== 1 ? 's' : ''}`}
                </Button>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                >
                  <p className="text-red-400 text-sm">Error: {error.message}</p>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Skills Overview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Your Skills</h3>
                <p className="text-slate-400 text-sm">Current skill set</p>
              </div>
            </div>

            {/* Skills Categories */}
            <div className="space-y-6">
              {[
                {
                  category: 'Frontend',
                  skills: ['React', 'TypeScript', 'Tailwind CSS'],
                  color: 'from-blue-500 to-cyan-500',
                },
                {
                  category: 'Backend',
                  skills: ['Node.js', 'Python', 'PostgreSQL'],
                  color: 'from-emerald-500 to-teal-500',
                },
                {
                  category: 'Tools',
                  skills: ['Git', 'Docker', 'AWS'],
                  color: 'from-purple-500 to-pink-500',
                },
              ].map((category, index) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="space-y-3"
                >
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    <div className={`w-3 h-3 bg-gradient-to-r ${category.color} rounded-full`} />
                    {category.category}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map(skill => (
                      <span
                        key={skill}
                        className={`px-3 py-1 bg-gradient-to-r ${category.color} bg-opacity-20 text-white text-sm rounded-full border border-slate-600/50`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Skill Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 p-4 bg-slate-700/30 border border-slate-600/50 rounded-xl"
            >
              <h4 className="font-semibold text-white mb-3">Skill Statistics</h4>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-emerald-400">12</div>
                  <div className="text-slate-400 text-sm">Total Skills</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">4.2</div>
                  <div className="text-slate-400 text-sm">Avg Rating</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Skills;
