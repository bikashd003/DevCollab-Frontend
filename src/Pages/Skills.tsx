import { useMutation, useQuery } from '@apollo/client';
import { Button } from '@nextui-org/react';
import { toast } from 'sonner';
import { Rate } from 'antd';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Star, Plus, Zap, Award, Trash2, Edit3, TrendingUp } from 'lucide-react';
import type { MultiValue, StylesConfig } from 'react-select';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import SkillList from '../Constant/Skills';
import { ADD_SKILL_MUTAION, DELETE_SKILL, UPDATE_SKILL } from '../GraphQL/Mutations/Profile/Skills';
import { GET_USER_SKILLS } from '../GraphQL/Queries/Profile/Skills';
import PageContainer from '../Components/Profile/PageContainer';

interface SkillOption {
  label: string;
  value: string;
}

interface UserSkill {
  id: string;
  title: string;
  proficiency: number;
  createdAt: string;
  updatedAt: string;
}

const customStyles: StylesConfig<SkillOption, true> = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    borderColor: state.isFocused ? '#64748b' : '#475569',
    boxShadow: state.isFocused ? '0 0 0 1px #64748b' : 'none',
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
    backgroundColor: state.isSelected ? '#64748b' : state.isFocused ? '#334155' : 'transparent',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#334155',
    },
  }),
  multiValue: provided => ({
    ...provided,
    backgroundColor: '#64748b',
  }),
  multiValueLabel: provided => ({
    ...provided,
    color: '#ffffff',
  }),
  multiValueRemove: provided => ({
    ...provided,
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#475569',
      color: '#ffffff',
    },
  }),
};

const Skills: React.FC = () => {
  const [selectedSkills, setSelectedSkills] = useState<MultiValue<SkillOption>>([]);
  const [rates, setRates] = useState<{ [key: string]: number }>({});
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [editRating, setEditRating] = useState<number>(0);
  const animatedComponents = makeAnimated();

  const { data: skillsData, loading: skillsLoading, refetch } = useQuery(GET_USER_SKILLS);

  const [createSkill, { loading: createLoading, error: createError }] = useMutation(
    ADD_SKILL_MUTAION,
    {
      onCompleted: () => {
        setSelectedSkills([]);
        setRates({});
        toast.success('Skills added successfully');
        refetch();
      },
      onError: error => {
        toast.error(`Error adding skills: ${error.message}`);
      },
    }
  );

  const [deleteSkill] = useMutation(DELETE_SKILL, {
    onCompleted: () => {
      toast.success('Skill deleted successfully');
      refetch();
    },
    onError: error => {
      toast.error(`Error deleting skill: ${error.message}`);
    },
  });

  const [updateSkill] = useMutation(UPDATE_SKILL, {
    onCompleted: () => {
      toast.success('Skill updated successfully');
      setEditingSkill(null);
      refetch();
    },
    onError: error => {
      toast.error(`Error updating skill: ${error.message}`);
    },
  });

  const userSkills: UserSkill[] = skillsData?.getUserSkills || [];

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

  const handleDeleteSkill = (id: string) => {
    deleteSkill({
      variables: { id },
    });
  };

  const handleUpdateSkill = (id: string, title: string) => {
    updateSkill({
      variables: {
        id,
        title,
        proficiency: editRating,
      },
    });
  };

  const startEditing = (skill: UserSkill) => {
    setEditingSkill(skill.id);
    setEditRating(skill.proficiency);
  };

  const cancelEditing = () => {
    setEditingSkill(null);
    setEditRating(0);
  };

  const availableSkills = SkillList.filter(
    skill =>
      !userSkills.some(userSkill => userSkill.title.toLowerCase() === skill.value.toLowerCase())
  );

  const totalSkills = userSkills.length;
  const averageRating =
    totalSkills > 0
      ? (userSkills.reduce((sum, skill) => sum + skill.proficiency, 0) / totalSkills).toFixed(1)
      : '0.0';

  const skillsByLevel = {
    expert: userSkills.filter(skill => skill.proficiency >= 4),
    intermediate: userSkills.filter(skill => skill.proficiency === 3),
    beginner: userSkills.filter(skill => skill.proficiency <= 2),
  };

  return (
    <PageContainer>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-600/10 to-slate-500/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-500 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Add Skills</h2>
                <p className="text-slate-400 text-sm">Select and rate your skills</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Select Skills</label>
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                placeholder="Search and select skills..."
                isMulti
                options={availableSkills}
                value={selectedSkills}
                onChange={e => setSelectedSkills(e)}
                className="w-full"
                styles={customStyles}
                noOptionsMessage={() => 'All available skills have been added'}
              />
            </div>

            {selectedSkills.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-slate-400" />
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
                          className="text-slate-400"
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
                className="w-full bg-gradient-to-r from-slate-600 to-slate-500 hover:from-slate-700 hover:to-slate-600 text-white font-semibold py-3 shadow-lg hover:shadow-slate-500/25"
                disabled={createLoading || selectedSkills.length === 0}
                startContent={
                  createLoading ? (
                    <Zap className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )
                }
              >
                {createLoading
                  ? 'Adding Skills...'
                  : `Add ${selectedSkills.length} Skill${selectedSkills.length !== 1 ? 's' : ''}`}
              </Button>
            </motion.div>

            {createError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
              >
                <p className="text-red-400 text-sm">Error: {createError.message}</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Your Skills</h3>
                  <p className="text-slate-400 text-sm">
                    {totalSkills > 0 ? `${totalSkills} skills added` : 'No skills added yet'}
                  </p>
                </div>
              </div>
              {totalSkills > 0 && (
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-300">{totalSkills}</div>
                    <div className="text-slate-500">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-300">{averageRating}</div>
                    <div className="text-slate-500">Avg Rating</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            {skillsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Zap className="w-6 h-6 animate-spin text-slate-400" />
                <span className="ml-2 text-slate-400">Loading skills...</span>
              </div>
            ) : totalSkills === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-slate-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Start Building Your Profile
                </h4>
                <p className="text-slate-400 text-sm mb-4">
                  Add your first skills to showcase your expertise and connect with the right
                  projects.
                </p>
                <div className="text-slate-500 text-xs">
                  Use the form on the left to get started
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {skillsByLevel.expert.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      Expert Level (4-5 ⭐)
                    </h4>
                    <div className="grid gap-2">
                      {skillsByLevel.expert.map((skill, index) => (
                        <motion.div
                          key={skill.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="flex items-center justify-between p-3 bg-slate-700/30 border border-slate-600/50 rounded-lg group hover:bg-slate-700/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-white capitalize">{skill.title}</span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < skill.proficiency
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-slate-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {editingSkill === skill.id ? (
                              <div className="flex items-center gap-2">
                                <Rate
                                  value={editRating}
                                  onChange={setEditRating}
                                  character={<Star className="w-3 h-3" />}
                                />
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 min-w-0"
                                  onClick={() => handleUpdateSkill(skill.id, skill.title)}
                                >
                                  ✓
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-slate-600 hover:bg-slate-700 text-white px-2 py-1 min-w-0"
                                  onClick={cancelEditing}
                                >
                                  ✕
                                </Button>
                              </div>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-slate-600 hover:bg-slate-700 text-white px-2 py-1 min-w-0"
                                  onClick={() => startEditing(skill)}
                                >
                                  <Edit3 className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 min-w-0"
                                  onClick={() => handleDeleteSkill(skill.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {skillsByLevel.intermediate.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      Intermediate Level (3 ⭐)
                    </h4>
                    <div className="grid gap-2">
                      {skillsByLevel.intermediate.map((skill, index) => (
                        <motion.div
                          key={skill.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="flex items-center justify-between p-3 bg-slate-700/30 border border-slate-600/50 rounded-lg group hover:bg-slate-700/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-white capitalize">{skill.title}</span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < skill.proficiency
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-slate-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {editingSkill === skill.id ? (
                              <div className="flex items-center gap-2">
                                <Rate
                                  value={editRating}
                                  onChange={setEditRating}
                                  character={<Star className="w-3 h-3" />}
                                />
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 min-w-0"
                                  onClick={() => handleUpdateSkill(skill.id, skill.title)}
                                >
                                  ✓
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-slate-600 hover:bg-slate-700 text-white px-2 py-1 min-w-0"
                                  onClick={cancelEditing}
                                >
                                  ✕
                                </Button>
                              </div>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-slate-600 hover:bg-slate-700 text-white px-2 py-1 min-w-0"
                                  onClick={() => startEditing(skill)}
                                >
                                  <Edit3 className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 min-w-0"
                                  onClick={() => handleDeleteSkill(skill.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {skillsByLevel.beginner.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      Learning Level (1-2 ⭐)
                    </h4>
                    <div className="grid gap-2">
                      {skillsByLevel.beginner.map((skill, index) => (
                        <motion.div
                          key={skill.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="flex items-center justify-between p-3 bg-slate-700/30 border border-slate-600/50 rounded-lg group hover:bg-slate-700/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-white capitalize">{skill.title}</span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < skill.proficiency
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-slate-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {editingSkill === skill.id ? (
                              <div className="flex items-center gap-2">
                                <Rate
                                  value={editRating}
                                  onChange={setEditRating}
                                  character={<Star className="w-3 h-3" />}
                                />
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 min-w-0"
                                  onClick={() => handleUpdateSkill(skill.id, skill.title)}
                                >
                                  ✓
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-slate-600 hover:bg-slate-700 text-white px-2 py-1 min-w-0"
                                  onClick={cancelEditing}
                                >
                                  ✕
                                </Button>
                              </div>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-slate-600 hover:bg-slate-700 text-white px-2 py-1 min-w-0"
                                  onClick={() => startEditing(skill)}
                                >
                                  <Edit3 className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 min-w-0"
                                  onClick={() => handleDeleteSkill(skill.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </PageContainer>
  );
};

export default Skills;
